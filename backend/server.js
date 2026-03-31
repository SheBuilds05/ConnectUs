const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database'); 
const { User, Runner } = require('./models');
const jwt = require("jsonwebtoken");
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5002;
const SECRET = "mysecretkey";
const user = {
  id: 1,
  email: "admin@test.com",
  password: "123456"
};

// 🔐 LOGIN
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== user.email || password !== user.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1d" });

  res.json({ token });
});

// 🔐 MIDDLEWARE
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const verifyToken = require('./middleware/auth');

app.get('/api/admin/dashboard', verifyToken, (req, res) => {
  res.json({
    message: "Welcome Admin",
    user: req.user
  });
});

// 🔐 PROTECTED ROUTE
app.get("/api/dashboard", authMiddleware, (req, res) => {
  res.json({
    jobs: 156,
    rating: 4.9,
    earnings: 1250
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check and root API
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to ConnectUs API' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Database Test Route
app.get('/api/test-db', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({ success: true, message: 'Database connected!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Inside your server.js, modify the startServer function:
async function startServer() {
    try {
        // Change from { alter: true } to { force: true } TEMPORARILY
        // WARNING: { force: true } DELETES ALL EXISTING DATA in your users table!
        await sequelize.sync({ force: true }); 
        console.log('✅ Database forced-synced (ALL DATA DELETED)');
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
    }
}
startServer();

module.exports = app;