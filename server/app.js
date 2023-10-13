const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const path = require('path');

const io = new Server(server); 

app.use("/", express.static(path.join(__dirname, "/public")));

const PORT = process.env.PORT || 3001;

io.on('connection', (socket) => {
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  })

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

