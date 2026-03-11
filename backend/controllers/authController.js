const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password, role, adminSecret } = req.body;
        
        // Admin Secret Check
        console.log("🔍 Received Register Request Body:", req.body);
        if (role === 'admin' && adminSecret !== process.env.ADMIN_REGISTRATION_SECRET) {
            return res.status(401).json({ success: false, message: "Invalid Admin Secret" });
        }
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        
        // Pass the plain password; the model hook will hash it
        const user = await User.create({
            name,
            email,
            password_hash: password, 
            role: role || 'customer'
        });
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ... keep login, getProfile, logout as they were
module.exports = { register, login, getProfile, logout };