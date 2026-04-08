import express from 'express';
import cors from 'cors';
import http from 'http'; 
import { Server } from 'socket.io'; 
import authRoutes from './routes/authRoutes';
import runnerRoutes from './routes/runnerRoutes'; 
import userRoutes from './routes/userRoutes';


const app = express();
const server = http.createServer(app); // Create HTTP server

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Update this to your frontend URL
    methods: ["GET", "POST"]
  }
});

// Simple test endpoint - add this
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});
app.use(cors());
app.use(express.json());
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});
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

// Use 'server.listen' instead of 'app.listen'
server.listen(5000, '0.0.0.0', () => {
  console.log('🚀 Server & Socket.io running on port 5000');
});

