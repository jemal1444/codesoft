// Import necessary modules
const express = require('express'); // Import express to create the server
const http = require('http'); // Import the http module to create the server
const socketIo = require('socket.io'); // Import socket.io for real-time communication
const mongoose = require('mongoose'); // Import mongoose to interact with MongoDB
const authRoutes = require('./routes/auth'); // Import authentication routes
const chatRoutes = require('./routes/chat'); // Import chat routes
const User = require('./models/User'); // Import the User model for database interactions
const cors = require('cors');


// Create an Express application
const app = express();

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize a new instance of socket.io by passing the server object
const io = socketIo(server);

// Define the port number the server will listen on
const PORT = 3000; // Ensure this matches your frontend connection settings

// Set mongoose options for stricter query parsing
mongoose.set('strictQuery', true); // or false, depending on your needs

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Task4_Realtime_ChatApp', {
  useNewUrlParser: true, // Use the new URL string parser
  useUnifiedTopology: true // Use the new server discovery and monitoring engine
})
  .then(() => {
    console.log('Connected to MongoDB'); // Log success message
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err); // Log error message
  });

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static files from the 'frontend' directory
app.use(express.static('frontend'));

// Use authentication routes for any requests to /api/auth
app.use('/api/auth', authRoutes);

// Use chat routes for any requests to /api/chat, passing the socket.io instance
app.use('/api/chat', chatRoutes(io));

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Event listener for joining a room
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Event listener for incoming messages
  socket.on('message', (message) => {
    const { room, text } = message;
    console.log(`Message received: ${text} in room: ${room}`);
    io.to(room).emit('message', text); // Broadcast message to the room
  });

  // Event listener for disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log success message
});
