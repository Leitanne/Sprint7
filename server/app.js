const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(join(__dirname, '..', 'public')));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join_room', ({ username, roomId }) => {
    socket.join(roomId);
    console.log(`User ${username} joined room: ${roomId}`);
    socket.username = username;
  });

  socket.on('chat message', ({ message, roomId }) => {
    io.to(roomId).emit('chat message', { username: socket.username, message: message });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(process.env.PORT, () => {
  console.log('server running at http://localhost:3000');
});
