import express from 'express';
import cors from 'cors';
import http from 'http'; // Add this
import { Server } from 'socket.io'; // Add this
import authRoutes from './routes/authRoutes';
import runnerRoutes from './routes/runnerRoutes'; 
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';

const app = express();
const server = http.createServer(app); // Create HTTP server

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Update this to your frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their private room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/runners', runnerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Use 'server.listen' instead of 'app.listen'
server.listen(5000, '0.0.0.0', () => {
  console.log('🚀 Server & Socket.io running on port 5000');
});