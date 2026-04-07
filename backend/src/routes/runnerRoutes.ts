import { Router } from 'express';
import {
  getRunners,
  getRunnerById,
  updateRunnerProfile,
  getRunnerStats
} from '../controllers/runnerController';

const router = Router();

router.get('/', getRunners);
router.get('/:runnerId', getRunnerById);
router.get('/:runnerId/stats', getRunnerStats);
router.put('/:runnerId', updateRunnerProfile);

export default router;