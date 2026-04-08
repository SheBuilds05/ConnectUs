import { Router } from 'express';
import { getEarnings, getEarningsHistory } from '../controllers/earningsController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getEarnings);
router.get('/history', getEarningsHistory);

export default router;