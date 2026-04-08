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



const corsOptions = {
  
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://localhost:8081', 
    'https://connect-us-bice-five.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  credentials: true
};


app.use(cors(corsOptions));
app.use(express.json());



const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000", 
      "http://localhost:8081", 
      "https://connect-us-bice-five.vercel.app"
    ], 
    methods: ["GET", "POST"]
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

// --- ROUTES ---

app.use('/api/auth', authRoutes);
app.use('/api/runners', runnerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', bookingRoutes);


app.get('/', (req, res) => {
  res.send('ConnectUs Backend is Live and Running!');
});

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server & Socket.io running on port ${PORT}`);
});
