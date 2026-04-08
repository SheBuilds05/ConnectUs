import { Router } from 'express';
import {
  getAvailableOrders,
  getActiveOrders,
  getCompletedOrders,
  acceptOrder,
  updateOrderStatus,
  getOrderById
} from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/available', getAvailableOrders);
router.get('/active', getActiveOrders);
router.get('/completed', getCompletedOrders);
router.get('/:id', getOrderById);
router.post('/:id/accept', acceptOrder);
router.patch('/:id/status', updateOrderStatus);

export default router;