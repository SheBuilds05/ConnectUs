import { Router } from 'express';
import {
  getRunners,
  getRunnerById,
  updateRunnerProfile,
  getRunnerStats,
  getRunnerProducts
} from '../controllers/runnerController';

const router = Router();

// ✅ Because the router is mounted at '/api/runners', use '/' for the base path
router.get('/', getRunners);

// 2. ID-based routes SECOND
router.get('/:runnerId', getRunnerById);
router.get('/:runnerId/stats', getRunnerStats);
router.put('/:runnerId', updateRunnerProfile);
router.get('/:runnerId/products', getRunnerProducts);

export default router;