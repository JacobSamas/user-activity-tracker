import { io } from "socket.io-client";

let socket; // Declare socket globally

export const initializeSocket = () => {
  if (!socket) {
    socket = io("http://localhost:8080", {
      transports: ["websocket"], // Ensure WebSocket transport is used
    });

    socket.on("connect", () => {
      console.log("WebSocket connection established with the server.");
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });
  }
  return socket;
};

export const sendTrackingData = (event, details = {}) => {
  if (socket) {
    const data = {
      event,
      details,
      timestamp: new Date().toISOString(), // Ensure ISO format
    };
    console.log("Sending data to backend via WebSocket:", data);
    socket.emit("message", JSON.stringify(data)); // Send as a JSON string for backend parsing
  } else {
    console.error("Socket is not initialized. Call initializeSocket first.");
  }
};
