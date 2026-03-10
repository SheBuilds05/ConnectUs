const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection, closeConnection } = require('./config/database'); // Updated import
const { User, Runner, syncDatabase } = require('./models');

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

// Sync database models
syncDatabase();

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test database route - Updated to use Sequelize
app.get('/api/test-db', async (req, res) => {
  try {
    const sequelize = require('./config/database').sequelize;
    await sequelize.authenticate();
    res.json({ 
      success: true, 
      message: 'Database connected!', 
      time: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed', 
      error: error.message 
    });
  }
});

// Get all users - Updated to use Sequelize
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'role', 'createdAt']
    });
    res.json({ 
      success: true, 
      data: users 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch users', 
      error: error.message 
    });
  }
});

// Create a new user - Updated to use Sequelize
app.post('/api/users', async (req, res) => {
  const { email, name, password, phone, role = 'customer' } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    const user = await User.create({
      email,
      name,
      password,
      phone,
      role
    });

    res.status(201).json({ 
      success: true, 
      message: 'User created successfully', 
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create user', 
      error: error.message 
    });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Get all runners - Updated to use Sequelize
app.get('/api/runners', async (req, res) => {
  try {
    const runners = await Runner.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'email', 'phone']
      }],
      order: [['rating', 'DESC']]
    });
    
    res.json({ 
      success: true, 
      data: runners 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch runners', 
      error: error.message 
    });
  }
});

// Get user bookings - You'll need to create a Booking model first
app.get('/api/users/:userId/bookings', async (req, res) => {
  const { userId } = req.params;
  
  try {
    // This query will work once you create the Booking model
    res.json({ 
      success: true, 
      message: 'Bookings endpoint - Booking model needed',
      data: [] 
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

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/admin', require('./routes/admin.routes')); // Comment this out temporarily
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
    await closeConnection();
    console.log('HTTP server closed');
  });
});

module.exports = app;