import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes';
import runnerRoutes from './routes/runnerRoutes'; 
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import bookingRoutes from './routes/bookingRoutes';

const app = express();
const server = http.createServer(app); 

app.use(cors({
  origin: true, 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

// New way - compatible with Express 5 / path-to-regexp 8
app.options('(.*)', cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('join', (userId) => socket.join(`user_${userId}`));
  socket.on('disconnect', () => console.log('User disconnected'));
});


app.use('/api/auth', authRoutes);
app.use('/api/runners', runnerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', bookingRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));
app.get('/', (req, res) => res.send('ConnectUs Backend is Live!'));

const PORT = Number(process.env.PORT) || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
