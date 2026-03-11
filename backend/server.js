const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./config/database'); 
const { User, Runner } = require('./models');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

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