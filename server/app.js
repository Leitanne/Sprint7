const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('./models/message');
const db = mongoose.connection;

//Configuración
const app = express();
const server = createServer(app);
const io = new Server(server);
mongoose.connect(process.env.URI + '/' + process.env.DATABASE);
app.use(express.static(join(__dirname, '..', 'public')));

// Sockets
io.on('connection', (socket) => {

  socket.on('join_room', ({ username, roomId }) => {
    socket.join(roomId);
    socket.username = username;
    io.to(roomId).emit('user_connected', `${username} se ha unido a la sala.`);
  });

  socket.on('request_messages', (roomId) => {
    Message.find({ roomId: roomId})
      .then((messages) => {
        socket.emit('load_messages', messages);
      })
      .catch((err) => {
        console.error('Error al recuperar mensajes:', err);
      });
  });

  socket.on('chat message', ({ message, roomId }) => {  
    
    const newMessage = new Message({
      username: socket.username,
      text: message,
      roomId: roomId,
    });
    
    newMessage.save()
      .then(() => {
        io.to(roomId).emit('chat message', { username: socket.username, message: message });
        })
      .catch((err) => {
        console.error('Error al guardar el mensaje:', err);
      });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Persistencia 
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a MongoDB');
});

// Servidor de express
server.listen(process.env.PORT, () => {
  console.log('Servidor funcionando en http://localhost:3000');
});
