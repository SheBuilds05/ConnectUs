import { Router } from 'express';
import {
  getRunnerProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';

const router = Router();

// GET /api/products/runner/:runnerId - Get all products for a specific runner
router.get('/runner/:runnerId', getRunnerProducts);

// GET /api/products/:productId - Get a single product by ID
router.get('/:productId', getProductById);

// POST /api/products - Add a new product
router.post('/', addProduct);

// PUT /api/products/:productId - Update a product
router.put('/:productId', updateProduct);

// DELETE /api/products/:productId - Delete a product
router.delete('/:productId', deleteProduct);

export default router;