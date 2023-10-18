"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
// Import the Message model from './Ports/message'
const message_1 = __importDefault(require("./Ports/message"));
dotenv_1.default.config();
const db = mongoose_1.default.connection;
// Configuration
const app = express();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
mongoose_1.default.connect(process.env.URI + '/' + process.env.DATABASE);
app.use(express.static(path_1.default.join(__dirname, '..', 'public')));
// Sockets
io.on('connection', (socket) => {
    socket.on('join_room', ({ username, roomId }) => {
        socket.join(roomId);
        socket.username = username; // Use 'as any' to attach 'username' property to the socket.
        io.to(roomId).emit('user_connected', `${username} se ha unido a la sala.`);
    });
    socket.on('request_messages', (roomId) => {
        message_1.default.find({ roomId: roomId })
            .then((messages) => {
            socket.emit('load_messages', messages);
        })
            .catch((err) => {
            console.error('Error al recuperar mensajes:', err);
        });
    });
    socket.on('chat message', ({ message, roomId }) => {
        const username = socket.username; // Use 'as any' to retrieve 'username'.
        if (username) {
            const newMessage = new message_1.default({
                username: username,
                text: message,
                roomId: roomId,
            });
            newMessage.save()
                .then(() => {
                io.to(roomId).emit('chat message', { username, message });
            })
                .catch((err) => {
                console.error('Error al guardar el mensaje:', err);
            });
        }
        else {
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
