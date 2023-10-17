const socket = io();

const loginContainer = document.querySelector('.login-container');
const chatContainer = document.querySelector('.chat-container');
let currentRoom = null;
let currentUsername = null;   

//---------- Login ---------//
function handleLogin() {
    const username = document.getElementById('username').value;
    const roomId = document.getElementById('roomId').value;

    if (username && roomId) {
        socket.emit("join_room", {username, roomId});
        loginContainer.style.display = 'none';
        chatContainer.style.display = 'flex';
        currentRoom = roomId;
        currentUsername = username;
        
        // ----------- Bienvenida ----------//
        socket.on('user_connected', (message) => {
            const messageContainer = document.querySelector('.chat-messages');
            const messageElement = document.createElement('div');
            messageElement.className = "message system"; // Clase para mensajes del sistema
            messageElement.textContent = message;
            messageContainer.appendChild(messageElement);
        });

        // ------------- Cargar mensajes previos ---------- //
        socket.on('load_messages', (messages) => {
            const messageContainer = document.querySelector('.chat-messages');
            messageContainer.innerHTML = ''; // Limpia los mensajes existentes
            
            messages.forEach((data) => {
            const messageElement = document.createElement('div');
            if (data.username === currentUsername) {
                messageElement.className = "message sender";
            } else { 
                messageElement.className = "message receiver";
            }
            messageElement.textContent = `${data.username}: ${data.text}`;
            messageContainer.appendChild(messageElement);
            });
        });

        socket.emit('request_messages', currentRoom);
    } else {
        alert('Please enter a username and room ID.'); 
    }
}

document.getElementById('loginButton').addEventListener('click', handleLogin);


//---------- Envio del mensaje ---------//
document.getElementById('Enviar').addEventListener("click", function() {
    const messageInput = document.getElementById("mensaje");
    const message = messageInput.value.trim(); 

    if (message) {
        socket.emit('chat message', { message, roomId: currentRoom });
        messageInput.value = '';
    }
});

// ---------- Recepción de mensaje --------//
socket.on('chat message', (data) => {    
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