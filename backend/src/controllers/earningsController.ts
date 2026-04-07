import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { query } from '../config/db';

export const getEarnings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
      return;
    }

    // Get summary
    const summary = await query(
      `SELECT 
        COALESCE(SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN amount END), 0) as today,
        COALESCE(SUM(CASE WHEN created_at >= date_trunc('week', CURRENT_DATE) THEN amount END), 0) as week,
        COALESCE(SUM(CASE WHEN created_at >= date_trunc('month', CURRENT_DATE) THEN amount END), 0) as month,
        COALESCE(SUM(amount), 0) as total
       FROM earnings 
       WHERE user_id = $1 AND status = 'completed'`,
      [userId]
    );

    // Get recent transactions
    const transactions = await query(
      `SELECT e.*, o.order_number, o.restaurant_name
       FROM earnings e
       LEFT JOIN orders o ON e.order_id = o.id
       WHERE e.user_id = $1
       ORDER BY e.created_at DESC
       LIMIT 20`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        summary: summary.rows[0],
        transactions: transactions.rows
      }
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

export const getEarningsHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { period = 'month' } = req.query;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
      return;
    }

    let interval: string;
    switch(period) {
      case 'week':
        interval = "date_trunc('day', created_at)";
        break;
      case 'month':
        interval = "date_trunc('week', created_at)";
        break;
      case 'year':
        interval = "date_trunc('month', created_at)";
        break;
      default:
        interval = "date_trunc('day', created_at)";
    }

    const result = await query(
      `SELECT ${interval} as date, SUM(amount) as total
       FROM earnings
       WHERE user_id = $1 AND status = 'completed'
       GROUP BY date
       ORDER BY date DESC
       LIMIT 30`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get earnings history error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};