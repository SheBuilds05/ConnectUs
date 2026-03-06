import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getReviews,
  getStats
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/reviews', getReviews);
router.get('/stats', getStats);

export default router;