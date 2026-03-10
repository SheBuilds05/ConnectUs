const { User } = require('../models');

// Logic only
const register = async (req, res) => {
    try {
        res.status(201).json({ message: "User registered" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export the functions, NOT routes
module.exports = {
    register,
    login
};