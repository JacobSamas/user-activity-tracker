const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { saveUserActivity } = require("./db");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust to match your frontend
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Default route to verify server is running
app.get("/", (req, res) => {
  res.send("User Activity Tracker is running!");
});

// WebSocket setup
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  // Listen for messages from the client
  ws.on("message", async (message) => {
    try {
      console.log("Raw message received from client:", message);

      // Parse the message as JSON
      const data = JSON.parse(message);
      console.log("Parsed data:", data);

      // Validate required fields
      if (!data.event || !data.details || !data.timestamp) {
        throw new Error("Invalid data format. Required: event, details, timestamp.");
      }

      // Save the event to the database
      await saveUserActivity(data);
      console.log("Data successfully saved to database:", data);

      // Send a success response back to the client
      ws.send(
        JSON.stringify({
          status: "success",
          message: "Event tracked and saved successfully.",
        })
      );
    } catch (error) {
      console.error("Error processing message:", error.message);

      // Send an error response back to the client
      ws.send(
        JSON.stringify({
          status: "error",
          message: error.message,
        })
      );
    }
  });

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
