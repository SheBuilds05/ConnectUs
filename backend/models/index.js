const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection, query, closePool } = require('./config/database.js');

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


// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// ... rest of your server.js code