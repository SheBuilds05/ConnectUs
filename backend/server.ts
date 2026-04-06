import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './src/routes/authRoutes';
import runnerRoutes from './src/routes/runnerRoutes';
import userRoutes from './src/routes/userRoutes';

const app = express();
const server = http.createServer(app);

//  Use ONLY one CORS declaration
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

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

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working!', timestamp: new Date().toISOString() });
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/api/auth', authRoutes);
app.use('/api/runners', runnerRoutes);
app.use('/api/users', userRoutes);

server.listen(5000, '0.0.0.0', () => {
  console.log('🚀 Server & Socket.io running on port 5000');
});