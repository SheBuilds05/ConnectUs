import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes';
import runnerRoutes from './routes/runnerRoutes'; 
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();
const server = http.createServer(app); 

//MIDDLEWARE (Order matters!)
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  credentials: true
};
app.use(cors(corsOptions));
app.use((req, res, next) => { if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-user-id'); res.setHeader('Access-Control-Allow-Credentials', 'true'); return res.sendStatus(200); } next(); });

app.use(express.json());

// SOCKET.IO INITIALIZATION
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"]
  }
});

//SOCKET.IO LOGIC
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

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/runners', runnerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Test endpoints
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// START SERVER
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server & Socket.io running on http://localhost:${PORT}`);
});


