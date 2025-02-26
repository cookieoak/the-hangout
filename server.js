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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const io = require('socket.io')(server);

let gameState = Array(9).fill(null);
let currentPlayer = 'X';

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('playerMove', (data) => {
        if (gameState[data.index] === null) {
            gameState[data.index] = data.player;
            io.emit('opponentMove', data);
            checkForWinner();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    });

    function checkForWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        winningCombinations.forEach(combination => {
            const [a, b, c] = combination;
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                io.emit('gameOver', `${gameState[a]} wins!`);
                gameState = Array(9).fill(null);
            }
        });
    }
});
