const express = require("express");
const http = require("http"); // Import http module first
const amqp = require("amqplib");
const cors = require("cors");
const app = express();
const admin = require("firebase-admin");
const serviceAccount = require("../../../firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gamebling-orbital-24-default-rtdb.firebaseio.com",
});

const db = admin.firestore(); // Assuming credentials in package.json (not recommended for production)
//import { firebaseConfig } from "../../auth/firebase-config"; // Assuming credentials in package.json (not recommended for production)

// Initialize Firebase Admin SDK
const port = 5000;
// Function to create a new game room (unchanged)
app.use(cors());
app.use(express.json());

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

// API endpoint to add a player to the queue
app.post("/enqueue", async (req, res) => {
  const { player } = req.body;
  if (!player) {
    return res.status(400).send("Player information is required");
  }

  try {
    channel.sendToQueue("player_queue", Buffer.from(JSON.stringify(player)), {
      persistent: true,
    });
    res.status(200).send("Player added to queue");
  } catch (error) {
    console.error("Error enqueuing player", error);
    res.status(500).send("Failed to enqueue player");
  }
});

// API endpoint to move player from queue to game room
app.post("/dequeue", async (req, res) => {
  try {
    const msg = await channel.get("player_queue", { noAck: false });
    if (msg) {
      const player = JSON.parse(msg.content.toString());
      const gameRoomRef = db.collection("gameRooms").doc("room1");
      const gameRoomSnap = await gameRoomRef.get();

      if (gameRoomSnap.exists) {
        const gameRoom = gameRoomSnap.data();
        const players = gameRoom.players || {};
        const playerId = `player${Object.keys(players).length + 1}`;
        players[playerId] = player;
        await gameRoomRef.update({ players });
        channel.ack(msg);
        res.status(200).send({ playerId, player });
      } else {
        res.status(404).send("Game room not found");
      }
    } else {
      res.status(200).send("Queue is empty");
    }
  } catch (error) {
    console.error("Error dequeuing player", error);
    res.status(500).send("Failed to dequeue player");
  }
});

connectToRabbitMQ().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
