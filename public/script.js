const socket = io();

const loginContainer = document.querySelector('.login-container');
const chatContainer = document.querySelector('.chat-container');
let currentRoom = null;
let currentUsername = null;   

//---------- Login ---------//
function handleLogin() {
    const username = document.getElementById('username').value;
    const roomId = document.getElementById('roomId').value;

    console.log('Login Data:', { username, roomId });

    if (username && roomId) {
        socket.emit("join_room", {username, roomId});
        loginContainer.style.display = 'none';
        chatContainer.style.display = 'flex';
        currentRoom = roomId;
        currentUsername = username;
    } else {
        alert('Please enter a username and room ID.'); 
    }
}

document.getElementById('loginButton').addEventListener('click', handleLogin);

//---------- Envio del mensaje ---------//
document.getElementById('Enviar').addEventListener("click", function() {
    const messageInput = document.getElementById("mensaje");
    const message = messageInput.value.trim(); 

    console.log('Sending message:', { message, currentRoom });

    if (message) {
        socket.emit('chat message', { message, roomId: currentRoom });
        messageInput.value = '';
    }
});

// ---------- Recepción de mensaje --------//
socket.on('chat message', (data) => {
    console.log('Received message:', data);
    
    const messageContainer = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    
    if (data.username === currentUsername) {
        messageElement.className = "message sender";
    } else {
        messageElement.className = "message receiver";
    }
    
    messageElement.textContent = `${data.username}: ${data.message}`;
    messageContainer.appendChild(messageElement);
});