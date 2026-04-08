import { Router } from 'express';
import {
  getRunners,
  getRunnerById,
  updateRunnerProfile,
  getRunnerStats,
  getPendingOrders,
  acceptOrder, 
  rejectOrder
} from '../controllers/runnerController';

const router = Router();

// 1. Static/Specific routes FIRST
router.get('/available', getPendingOrders); // Now this will work!
router.get('/', getRunners);

// 2. ID-based routes SECOND
router.get('/:runnerId', getRunnerById);
router.get('/:runnerId/stats', getRunnerStats);
router.put('/:runnerId', updateRunnerProfile);

// 3. Action routes
router.put('/accept/:bookingId', acceptOrder);
router.put('/reject/:bookingId', rejectOrder);

export default router;