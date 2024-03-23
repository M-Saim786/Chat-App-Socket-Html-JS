const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const socketIO = require('socket.io');

const users = {};

// Use cors middleware to enable CORS for all routes
app.use(cors());

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    // origin: 'http://127.0.0.1:5500',  // Adjust this based on your frontend URL
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('new-user-joined', (name) => {
    console.log('New user joined:', name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', (message, username) => {
    // const username = users[socket.id];
    console.log(message);
    socket.broadcast.emit('receive', { message, name: username });
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit('user-left', username);
    console.log('User disconnected:', username);
  });
});

const port = process.env.PORT || 5000; // Use environment variable for port or default to 5000
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
