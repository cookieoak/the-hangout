const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/games', (req, res) => {
    res.sendFile(__dirname + '/public/games.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/chat.html');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chatMessage', (data) => {
        io.emit('chatMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
