import { io } from "socket.io-client";

let socket;

export const initializeSocket = () => {
    if (!socket) {
        socket = io("http://localhost:8080", {
            transports: ["websocket"], // Ensure WebSocket transport is used
        });
        console.log("WebSocket connected");
    }
    return socket;
};

export const sendTrackingData = (event, details = {}) => {
    if (socket) {
        const data = {
            event,
            details,
            timestamp: new Date().toISOString(),
        };
        socket.emit("track_event", data);
        console.log("Sent tracking data:", data);
    }
};
