const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" folder
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

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
