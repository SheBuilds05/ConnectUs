import { Router } from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus
} from '../controllers/bookingController';

const router = Router();

// ✅ Make sure all these functions exist in your controller
router.post('/bookings', createBooking);
router.get('/users/:userId/bookings', getUserBookings);
router.get('/bookings/:bookingId', getBookingById);
router.patch('/bookings/:bookingId/status', updateBookingStatus);

export default router;