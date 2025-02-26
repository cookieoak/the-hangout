const socket = io();

let username;
while (!username) {
    username = prompt('Enter your username:');
}

document.getElementById('send').addEventListener('click', function() {
    const message = document.getElementById('message').value;
    if (message) {
        socket.emit('chatMessage', { username, message });
        document.getElementById('message').value = '';
    }
});

socket.on('chatMessage', function(data) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.username}: ${data.message}`;
    document.getElementById('messages').appendChild(messageElement);
});
