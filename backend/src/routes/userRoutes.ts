import { Router } from 'express';
import { 
  createBooking,      
  getUserBookings, 
  getUserProfile,     
  updateUserProfile,  
  cancelBooking,
  getBookingStatus, 
  getWallet,      
  topUpWallet,
  withdrawFunds,
  getRunnerById
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
router.get('/:userId/wallet', getWallet);
router.post('/:userId/wallet/topup', topUpWallet);
router.post('/:userId/wallet/withdraw', withdrawFunds);
router.get('/runners/:runnerId', getRunnerById);

export default router;