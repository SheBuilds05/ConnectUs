const { User, Runner } = require('../models');
const { Op } = require('sequelize'); // For advanced searching

// GET ALL USERS & RUNNERS
const getAllData = async (req, res) => {
    try {
        // Fetch customers with specific fields
        const users = await User.findAll({ 
            where: { role: 'customer' },
            attributes: ['id', 'name', 'email', 'status', 'admin_note', 'createdAt']
        });

        // Fetch runners and INCLUDE their Runner Profile details (vehicle, rating, etc.)
        const runners = await User.findAll({ 
            where: { role: 'runner' },
            attributes: ['id', 'name', 'email', 'status', 'admin_note', 'createdAt'],
            include: [{
                model: Runner,
                as: 'runnerProfile' // Ensure this matches the alias in your models/index.js associations
            }]
        });

        res.json({ 
            success: true, 
            count: { users: users.length, runners: runners.length },
            users, 
            runners 
        });
    } catch (error) {
        console.error('Admin Fetch Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// PENALIZE OR BLOCK
const updateStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, notice } = req.body; 

        // 1. Validation: Ensure status is one of the allowed types
        const allowedStatuses = ['active', 'blocked', 'penalized', 'suspended'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status type' });
        }

        // 2. Security: Prevent admin from blocking themselves (req.user comes from protect middleware)
        if (parseInt(userId) === req.user.id) {
            return res.status(400).json({ success: false, message: 'You cannot change your own status' });
        }

        // 3. Update the database
        const [updated] = await User.update(
            { 
                status: status, 
                admin_note: notice || 'No specific reason provided by admin' 
            }, 
            { where: { id: userId } }
        );

        if (updated === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ 
            success: true, 
            message: `User status successfully updated to ${status}`,
            updatedDetails: { userId, status, notice }
        });
    } catch (error) {
        console.error('Admin Update Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// SEARCH USERS (New Utility for Admin)
const searchUsers = async (req, res) => {
    const { query } = req.query;
    try {
        const results = await User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } }
                ]
            },
            limit: 10
        });
        res.json({ success: true, results });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { 
    getAllData, 
    updateStatus,
    searchUsers 
};