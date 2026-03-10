const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

console.log("DEBUG: Admin Controller exports:", adminController);

// Admin Dashboard
router.get('/dashboard', verifyToken, isAdmin, adminController.getAdminDashboard);

// Penalize a specific runner
router.post('/penalize/:runnerId', verifyToken, isAdmin, adminController.penalizeRunner);
// Get all runners
router.get('/runners', verifyToken, isAdmin, adminController.getAllRunners);

module.exports = router;