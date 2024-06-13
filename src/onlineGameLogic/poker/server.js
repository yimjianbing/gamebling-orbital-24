const express = require("express");
const http = require("http"); // Import http module first
const app = express();
const socketIO = require("socket.io");
const server = http.createServer(app); // Create server using http module
const io = socketIO(server); // Initialize socket.io with the created server
const admin = require("firebase-admin");
const firebaseConfig = require("../../../package.json").firebase; // Assuming credentials in package.json (not recommended for production)

// Initialize Firebase Admin SDK
admin.initializeApp(firebaseConfig);

const db = admin.firestore(); // Using Firestore instead of Realtime Database

// Function to create a new game room (unchanged)
function createGameRoom(roomId, gameData) {
  return db.collection("GameRooms").doc(roomId).set(gameData);
}

// Function to get game room data (unchanged)
function getGameRoom(roomId) {
  return db
    .collection("GameRooms")
    .doc(roomId)
    .get()
    .then((docSnap) => {
      if (docSnap.exists) {
        return docSnap.data();
      } else {
        return null;
      }
    });
}

// Function to update game room data (unchanged)
function updateGameRoom(roomId, gameData) {
  return db.collection("GameRooms").doc(roomId).update(gameData);
}

// Function to delete a game room (unchanged)
function deleteGameRoom(roomId) {
  return db.collection("GameRooms").doc(roomId).delete();
}

// Express app setup (basic example)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html"); // Serve a basic HTML file
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected!");

  // Handle game room creation requests from clients
  socket.on("createGameRoom", async (roomId, gameData) => {
    try {
      await createGameRoom(roomId, gameData);
      socket.emit("gameRoomCreated", roomId); // Emit event to client
    } catch (error) {
      console.error("Error creating game room:", error);
      socket.emit("gameRoomCreationError"); // Emit error event to client
    }
  });

  // Handle game room data requests from clients
  socket.on("getGameRoom", async (roomId) => {
    try {
      const roomData = await getGameRoom(roomId);
      if (roomData) {
        socket.emit("gameRoomData", roomData);
      } else {
        socket.emit("gameRoomNotFound");
      }
    } catch (error) {
      console.error("Error getting game room:", error);
      socket.emit("gameRoomError");
    }
  });

  // Handle other events for game room updates (implement logic as needed)
  // ... (e.g., player actions, game state updates)

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected!");
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server listening on port 3000!");
});

// Export functions (optional)
module.exports = {
  createGameRoom,
  getGameRoom,
  updateGameRoom,
  deleteGameRoom,
};
