const express = require('express');
import http from 'http';
import path from 'path';
import { Server as SocketIO } from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

// Define the schema for the "Message" model.
interface IMessage extends Document {
  username: string;
  text: string;
  roomId: string;
}

// Import the Message model from './Ports/message'
import Message from './Ports/message';

dotenv.config();
const db = mongoose.connection;

// Configuration
const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);
mongoose.connect(process.env.URI + '/' + process.env.DATABASE);
app.use(express.static(path.join(__dirname, '..', 'public')));

// Sockets
io.on('connection', (socket) => {
  socket.on('join_room', ({ username, roomId }: { username: string, roomId: string }) => {
    socket.join(roomId);
    (socket as any).username = username; // Use 'as any' to attach 'username' property to the socket.
    io.to(roomId).emit('user_connected', `${username} se ha unido a la sala.`);
  });

  socket.on('request_messages', (roomId: string) => {
    Message.find({ roomId: roomId })
      .then((messages: IMessage[]) => {
        socket.emit('load_messages', messages);
      })
      .catch((err: Error) => {
        console.error('Error al recuperar mensajes:', err);
      });
  });

  socket.on('chat message', ({ message, roomId }: { message: string, roomId: string }) => {
    const username = (socket as any).username; // Use 'as any' to retrieve 'username'.
    if (username) {
      const newMessage = new Message({
        username: username,
        text: message,
        roomId: roomId,
      });

      newMessage.save()
        .then(() => {
          io.to(roomId).emit('chat message', { username, message });
        })
        .catch((err: Error) => {
          console.error('Error al guardar el mensaje:', err);
        });
    } else {
      console.error('Username not found for the socket.');
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Persistence
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a MongoDB');
});

// Express server
server.listen(process.env.PORT, () => {
  console.log('Servidor funcionando en http://localhost:3000');
});