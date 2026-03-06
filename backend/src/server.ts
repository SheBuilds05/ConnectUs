import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';
import earningsRoutes from './routes/earningsRoutes';

dotenv.config();

// DECLARE app FIRST
const app = express();

// THEN use middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// THEN use routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/earnings', earningsRoutes);

// Health check - ADD THIS HERE
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'ConnectUs Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/api/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is working!',
    data: {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
  console.log(`🔧 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});