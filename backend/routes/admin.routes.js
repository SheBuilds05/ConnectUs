const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { 
  getAdminDashboard, 
  penalizeRunner, 
  getAllRunners 
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All admin routes should be protected with both protect and admin middleware
router.get('/dashboard', protect, admin, getAdminDashboard);
router.get('/runners', protect, admin, getAllRunners);
router.put('/runners/:runnerId/penalize', protect, admin, penalizeRunner);

// Add any other admin routes here

module.exports = router;