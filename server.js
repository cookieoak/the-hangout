const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allows all connections (fixes CORS issues)
        methods: ["GET", "POST"]
    }
});

// Enable CORS for static files
app.use(cors());

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

// Handle real-time chat
io.on("connection", (socket) => {
    console.log("A user connected!");

    socket.on("chatMessage", (data) => {
        io.emit("chatMessage", data); // Broadcast message with username
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected.");
    });
});

// Use Render's dynamic port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
