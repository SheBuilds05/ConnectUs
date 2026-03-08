import { Router } from 'express';
import { 
  createBooking,      // Added: to handle new bookings from UserBookings.tsx
  getUserBookings, 
  getUserProfile,     // Added: to load initial data in UserSettings.tsx
  updateUserProfile,  // Updated: renamed to match the Settings logic
  cancelBooking,
  getBookingStatus
} from '../controllers/userController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = Router();
router.use(authenticateUser);

router.post('/bookings', createBooking); 
router.get('/:userId/bookings', getUserBookings);
router.get('/bookings/:bookingId/track', getBookingStatus);
router.put('/bookings/:bookingId/cancel', cancelBooking);
router.get('/:userId/profile', getUserProfile);
router.put('/:userId/profile', updateUserProfile);

export default router;