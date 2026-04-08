import { Router } from 'express';
import { registerCustomer, 
  registerRunner, 
  registerAdmin, 
  login, 
  getCurrentUser } from '../controllers/authController';


const router = Router();
router.post('/register/admin', registerAdmin);
router.post('/register/customer', registerCustomer);
router.post('/register/runner', registerRunner);
router.post('/login', login);
router.get('/me', getCurrentUser);

export default router;