
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = socketIo(httpServer, {
    cors: {
      origin: "*", // Add the appropriate origin or change "*" if needed
      methods: ["GET", "POST"]
    }
  });

  // Socket.io event handlers
  io.on('connection', (socket) => {
    console.log('New client connected');

    // User joins their own room based on userId
    socket.on('joinRoom', ({ userId }) => {
      socket.join(userId);
      console.log(`User with ID: ${userId} joined room: ${userId}`);
    });

    // Handle user message event
    socket.on('userMessage', (msg) => {
      console.log(`User ${msg.sender} sent message: ${msg.message}`);
      io.to('admin').emit('message', msg);  // Notify admin
      io.to(msg.sender).emit('message', msg); // Notify user (sender)
    });

    // Handle admin reply event
    socket.on('adminReply', (msg) => {
      console.log(`Admin replied to ${msg.receiver}: ${msg.message}`);
      io.to(msg.receiver).emit('message', msg); // Notify user
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // Handle all other routes for Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  httpServer.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
});

