import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection, query, closePool } from './config/database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection on startup
testConnection();

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test database route
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await query('SELECT NOW() as current_time');
    res.json({ 
      success: true, 
      message: 'Database connected!', 
      time: result.rows[0].current_time 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// Get all users (example route)
app.get('/api/users', async (req, res) => {
  try {
    const result = await query('SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC');
    res.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users', 
      error: error.message 
    });
  }
});

// Create a new user (example route)
app.post('/api/users', async (req, res) => {
  const { email, name, password, role = 'customer' } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }

  try {
    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Insert new user (in production, hash the password!)
    const result = await query(
      'INSERT INTO users (email, name, password, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at',
      [email, name, password, role]
    );

    res.status(201).json({ 
      success: true, 
      message: 'User created successfully', 
      data: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create user', 
      error: error.message 
    });
  }
});

// Get all runners with their user info
app.get('/api/runners', async (req, res) => {
  try {
    const result = await query(`
      SELECT r.*, u.name, u.email, u.phone 
      FROM runners r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.rating DESC
    `);
    res.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch runners', 
      error: error.message 
    });
  }
});

// Get user bookings
app.get('/api/users/:userId/bookings', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = await query(`
      SELECT b.*, 
             u.name as customer_name,
             r.name as runner_name
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN runners rn ON b.runner_id = rn.id
      JOIN users r ON rn.user_id = r.id
      WHERE b.customer_id = $1 OR rn.user_id = $1
      ORDER BY b.booking_date DESC
    `, [userId]);
    
    res.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch bookings', 
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: err.message 
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
  console.log(`🔍 Test DB: http://localhost:${PORT}/api/test-db`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await closePool();
    console.log('HTTP server closed');
  });
});