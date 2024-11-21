const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { saveUserActivity } = require("./db");
require("dotenv").config();
const winston = require("winston");

// Set up Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "server.log" }),
  ],
});

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
  logger.info("GET / route accessed");
  res.send("User Activity Tracker is running!");
});

// WebSocket setup
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  logger.info("New client connected");

  // Listen for messages from the client
  ws.on("message", async (message) => {
    try {
      console.log("Raw message received:", message);

      const data = JSON.parse(message);
      console.log("Parsed message:", data);

      // Validate required fields
      if (!data.event || !data.details) {
        throw new Error("Invalid data: 'event' and 'details' are required.");
      }

      // Save data to the database
      const result = await saveUserActivity(data);
      console.log("Data saved successfully:", result);

      // Send success response
      ws.send(
        JSON.stringify({
          status: "success",
          message: "Event tracked and saved successfully.",
        })
      );
    } catch (error) {
      console.error("Error processing message:", error.message, error.stack);

      // Send error response
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
    logger.info("Client disconnected");
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Shutting down server...");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});
