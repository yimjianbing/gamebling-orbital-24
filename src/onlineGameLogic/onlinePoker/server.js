const express = require("express");
const amqp = require("amqplib");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("../../firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gamebling-orbital-24-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// app.use("/", (req, res) => {
//   res.send("Welcome to the Poker Server");
// });

let channel, connection;

// Connect to RabbitMQ
async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect("amqp://localhost");
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
    console.log("Player added to queue 1");
  } catch (error) {
    console.error("Error enqueuing player:", error);
    throw error;
  }
}

async function dequeuePlayer(timeout = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Timeout: No player dequeued within 15 seconds"));
    }, timeout);

    // Consume messages from "player_queue"
    channel.consume(
      "player_queue",
      (msg) => {
        clearTimeout(timer); // Clear the timeout since player is dequeued
        if (msg !== null) {
          const player = JSON.parse(msg.content.toString());
          console.log(`Player dequeued: ${player.name}`);

          // Acknowledge the message (mark it as processed)
          channel.ack(msg);
          resolve(player); // Resolve the promise with the dequeued player
        } else {
          console.log("Queue is empty");
          resolve(null); // Resolve with null if queue is empty
        }
      },
      { noAck: false } // Ensure messages are not automatically acknowledged
    );

    // Handle errors during message consumption
    channel.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

// Method to dequeue a player from RabbitMQ and add to poker room in Firebase
// async function dequeuePlayerToPokerRoom() {
//   try {
//     const msg = await channel.get("player_queue", { noAck: false });
//     if (msg) {
//       const player = JSON.parse(msg.content.toString());
//       const gameRoomRef = db.collection("gameRooms").doc("room1");
//       const gameRoomSnap = await gameRoomRef.get();

//       if (gameRoomSnap.exists) {
//         const gameRoom = gameRoomSnap.data();
//         const players = gameRoom.players || {};
//         const playerId = `player${Object.keys(players).length + 1}`;
//         players[playerId] = player;
//         await gameRoomRef.update({ players });
//         channel.ack(msg);
//         console.log("Player moved from queue to poker room");
//         return { playerId, player };
//       } else {
//         console.log("Game room not found");
//         return null;
//       }
//     } else {
//       console.log("Queue is empty");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error dequeuing player:", error);
//     throw error;
//   }
// }

// API endpoint to add a player to the queue
app.post("/enqueue", async (req, res) => {
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
app.post("/dequeue", async (req, res) => {
  try {
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
