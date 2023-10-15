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
  console.log('a user connected')
});

server.listen(process.env.PORT, () => {
  console.log('server running at http://localhost:3000');
});
