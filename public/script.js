const socket = io();

document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.querySelector('#loginButton');
    const loginContainer = document.querySelector('.login-container');
    const chatContainer = document.querySelector('.chat-container');

    if (loginButton && loginContainer && chatContainer) {
        loginButton.addEventListener('click', function() {
            socket.emit("join_room", roomId);

            loginContainer.style.display = 'none';
            chatContainer.style.display = 'flex';
        });
    }
});

document.getElementById('Enviar').addEventListener("click", function() {
    const item = document.createElement('div');
    item.className = "message sender";
    item.textContent = document.getElementById("mensaje");
    
});