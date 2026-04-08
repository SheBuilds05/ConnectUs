import { Router } from 'express';
import { 
  getAllUsers, 
  getAllRunners, 
  updateBlockStatus, 
  deleteEntity 
} from '../controllers/adminController';

const router = Router();

// Get lists
router.get('/users', getAllUsers);
router.get('/runners', getAllRunners);
router.get('/activity', (req, res) => res.json([]));

router.patch('/:type/:id/block', (req, res, next) => {
    const type = Array.isArray(req.params.type) ? req.params.type[0] : req.params.type;
    req.params.type = type.endsWith('s') 
        ? type.slice(0, -1) 
        : type;
    next();
}, updateBlockStatus);

router.delete('/:type/:id', (req, res, next) => {
    const type = Array.isArray(req.params.type) ? req.params.type[0] : req.params.type;
    req.params.type = type.endsWith('s') 
        ? type.slice(0, -1) 
        : type;
    next();
}, deleteEntity);

export default router;