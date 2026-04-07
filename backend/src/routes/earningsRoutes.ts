import { Router } from 'express';
import { getEarnings, getEarningsHistory } from '../controllers/earningsController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// All earnings routes require authentication
router.use(protect);

// GET /api/earnings - Get earnings summary and transactions
router.get('/', getEarnings);

// GET /api/earnings/history - Get earnings history for charts
router.get('/history', getEarningsHistory);

export default router;