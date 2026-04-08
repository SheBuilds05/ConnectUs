import { Router } from 'express';
import { 
  createBooking, 
  getUserBookings, 
  getUserProfile, 
  updateUserProfile, 
  cancelBooking,
  getBookingStatus,
  getAvailableOrders // Imported from the controller
} from '../controllers/userController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = Router();

// This protects all routes below it
router.use(authenticateUser);

// This matches http://localhost:5000/api/bookings/pending
router.get('/pending', getAvailableOrders); 

router.post('/bookings', createBooking); 
router.get('/:userId/bookings', getUserBookings);
router.get('/bookings/:bookingId/track', getBookingStatus);
router.put('/bookings/:bookingId/cancel', cancelBooking);
router.get('/:userId/profile', getUserProfile);
router.put('/:userId/profile', updateUserProfile);

export default router;