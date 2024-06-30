const express = require("express");
const amqp = require("amqplib");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("../../src/firebaseServiceAccount.json");
const { collection, getDocs, addDoc } = require("firebase/firestore");
const axios = require("axios");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gamebling-orbital-24-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let channel, connection;

// Connect to RabbitMQ
async function connectToRabbitMQ() {
  try {
    // connection = await amqp.connect("amqp://localhost");
    connection = await amqp.connect("amqp://gamebling-orbital-24.vercel.app");
    channel = await connection.createChannel();
    await channel.assertQueue("player_queue", { durable: true });
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
    process.exit(1);
  }
}

// Method to add a player to the queue in RabbitMQ
async function addPlayerToQueue(player) {
  try {
    const playerData = JSON.stringify(player); // Convert player object to JSON string
    channel.sendToQueue("player_queue", Buffer.from(playerData), {
      persistent: true,
    });
    console.log("Player added to queue 1", player.id);
  } catch (error) {
    console.error("Error enqueuing player:", error);
    throw error;
  }
}


async function dequeuePlayer(timeout = 15000) {
  return new Promise((resolve, reject) => {
    let consumed = false;
    console.log(consumed);
    const timer = setTimeout(() => {
      if (!consumed) {
        cleanup();
        reject(new Error("Timeout: No player dequeued within 15 seconds"));
      }
    }, timeout);

    const errorHandler = (err) => {
      if (!consumed) {
        cleanup();
        // consumed = false;
        reject(err);
      }
    };

    const cleanup = () => {
      channel.removeListener("error", errorHandler);
      clearTimeout(timer);
    };

    // Attach error listener
    channel.once("error", errorHandler);
    channel.on("error", errorHandler);

    // Consume messages from "player_queue"
    const result = channel.consume(
      "player_queue",
      (msg) => {
        consumed = false;
        if (!consumed) {
          consumed = true;
          cleanup();

          if (msg !== null) {
            const player = JSON.parse(msg.content.toString());
            console.log(`Player dequeued: ${player.name}`);

            channel.ack(msg);
            resolve(player);
          } else {
            console.log("Queue is empty");
            resolve(null);
          }
        }
      },
      { noAck: false }
    ).then((result) => {
      channel.cancel(result.consumerTag);
    });

   
    // channel.on("error", errorHandler);
    // channel.once("error", cleanup);
  });
}

// API endpoint to add a player to the queue
app.post("/api/enqueue", async (req, res) => {
  console.log("Request received to enqueue player");
  const { player } = req.body;
  if (!player) {
    return res.status(400).send("Player information is required");
  }

  try {
    await addPlayerToQueue(player);
    res.status(200).json({ message: "Player added to queue" });
  } catch (error) {
    res.status(500).json({ message: "Failed to enqueue player" });
  }
});

// API endpoint to move player from queue to game room
app.post("/api/dequeue", async (req, res) => {
  try {
    const queueStatus = await channel.checkQueue("player_queue");

    console.log(`Queue has ${queueStatus.messageCount} message(s)`);

    const result = await dequeuePlayer();
    if (result) {
      res.status(200).send(result);
    } else {
      res.status(200).send("Queue is empty or game room not found");
    }
  } catch (error) {

    res.status(500).send("Failed to dequeue player");
  }
});

connectToRabbitMQ().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Firebase methods
async function checkAndCreateRoom(player) {
  try {
    // console.log("Checking and creating room for player:", player);
    const roomsCollection = db.collection("GameRooms"); // Correct Firestore usage
    const roomsSnapshot = await roomsCollection.get();
    // console.log("Rooms snapshot:", roomsSnapshot);

    let emptyRooms = [];

    roomsSnapshot.forEach((doc) => {
      const roomData = doc.data();
      const isGameStateEmpty = Object.keys(roomData.state || {}).length === 0;
      const playersArray = roomData.players;
      const isPlayersArrayNotFull =
        playersArray.length === 5 &&
        playersArray.some((p) => p === null || Object.keys(p).length === 0);

      if (isPlayersArrayNotFull) {
        emptyRooms.push({ id: doc.id, ...roomData });
      }
    });

    if (emptyRooms.length === 0) {
      // No empty rooms found, create a new one
      const newRoom = {
        state: {
          loading: true,
          winnerFound: null,
          players: null,
          numPlayersActive: null,
          numPlayersFolded: null,
          numPlayersAllIn: null,
          activePlayerIndex: null,
          dealerIndex: null,
          blindIndex: null,
          deck: null,
          communityCards: [],
          pot: null,
          highBet: null,
          betInputValue: null,
          sidePots: [],
          minBet: 20,
          phase: "loading",
          playerHierarchy: [],
          showDownMessages: [],
          playActionMessages: [],
          playerAnimationSwitchboard: {
            0: { isAnimating: false, content: null },
            1: { isAnimating: false, content: null },
            2: { isAnimating: false, content: null },
            3: { isAnimating: false, content: null },
            4: { isAnimating: false, content: null },
            5: { isAnimating: false, content: null },
          },
        },
        players: new Array(5).fill(null),
      };

      // Add the player to the new room
      newRoom.players[0] = player;

      const newRoomRef = await roomsCollection.add(newRoom);
      console.log(`Created a new room with ID: ${newRoomRef.id}`);
      return newRoomRef.id;
    } else {
      console.log("hello world");
      // Join the first empty room found
      const roomID = emptyRooms[0].id;
      await joinRoom(roomID, player);
      return roomID;
    }
  } catch (error) {
    console.error("Error in checkAndCreateRoom:", error);
    throw error;
  }
}

async function joinRoom(roomID, player) {
  let unsubscribe = null;

  try {
    const roomRef = db.collection("GameRooms").doc(roomID);

    // Set up a listener to monitor the room document
    unsubscribe = roomRef.onSnapshot(async (roomDoc) => {
      if (!roomDoc.exists) {
        throw new Error("Room does not exist");
      }

      const roomData = roomDoc.data();
      const playersArray = roomData.players;
      const emptyIndex = playersArray.findIndex(
        (p) => p === null || Object.keys(p).length === 0
      );

      if (emptyIndex !== -1) {
        playersArray[emptyIndex] = player;
        await roomRef.update({ players: playersArray });
        console.log(`Player added to room ${roomID}`);

        // Unsubscribe from the listener once the player is added
        if (unsubscribe) {
          unsubscribe();
        }
      } else {
        throw new Error("Room is full");
      }
    });
  } catch (error) {
    console.error("Error in joinRoom:", error);

    // Ensure to unsubscribe if an error occurs
    if (unsubscribe) {
      unsubscribe();
    }

    throw error;
  }
}

app.post("/api/checkAndCreateRoom", async (req, res) => {
  const player = req.body.player;
  if (!player) {
    return res.status(400).send({ error: "Player object is required" });
  }
  try {
    const result = await checkAndCreateRoom(player);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error checking or creating rooms:", error);
    res.status(500).send({ error: "Failed to check or create rooms" });
  }
});

module.exports = app;
