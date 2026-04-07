// routes/runnerProfileRoutes.ts
import { Router, Request, Response } from 'express';
import { Pool } from 'pg';

const router = Router();
const db = new Pool(); // assuming you have a database connection pool

// GET /api/runnerprofile - Fetch all runners
router.get('/runnerprofile', async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM runnerprofile');
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error('Error fetching runners:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/runnerprofile/:id - Fetch a single runner by ID
router.get('/runnerprofile/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM runnerprofile WHERE runner_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Runner not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('Error fetching runner:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/runnerprofile/:id/products - Fetch products for a specific runner
router.get('/runnerprofile/:id/products', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM products WHERE runner_id = $1', [id]);
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;