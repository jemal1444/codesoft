const express = require('express');
const router = express.Router();

// Handle chat-related functionality
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    // Join room
    socket.on('joinRoom', (room) => {
      socket.join(room);
      socket.to(room).emit('message', `A new user has joined the room: ${room}`);
    });

    // Listen for chat messages
    socket.on('message', (msg) => {
      // Broadcast message to all clients in the same room
      const rooms = Object.keys(socket.rooms);
      const currentRoom = rooms.length > 1 ? rooms[1] : null;
      if (currentRoom) {
        io.to(currentRoom).emit('message', msg);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return router;
};
