const WebSocket = require("ws");
const { saveUserActivity } = require("./db");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port: PORT });
console.log(`WebSocket server is running on ws://localhost:${PORT}`);

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      console.log("Received data:", data);

      if (!data.event || !data.timestamp) {
        throw new Error("Invalid data format");
      }

      await saveUserActivity(data);

      ws.send(JSON.stringify({ status: "success", message: "Event tracked" }));
    } catch (err) {
      console.error("Error processing message:", err.message);
      ws.send(JSON.stringify({ status: "error", message: err.message }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error.message);
  });
});
