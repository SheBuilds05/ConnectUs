import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { query } from '../config/db';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
      return;
    }

    const result = await query(
      `SELECT id, name, email, role, rating, total_trips, total_earnings, 
              avatar_url, is_online, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, avatar_url } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
      return;
    }

    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           avatar_url = COALESCE($2, avatar_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, name, email, role, rating, total_trips, total_earnings, avatar_url, is_online`,
      [name, avatar_url, userId]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

export const getReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
      return;
    }

    const result = await query(
      `SELECT * FROM reviews 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
      return;
    }

    const result = await query(
      `SELECT 
        (SELECT COUNT(*) FROM orders WHERE assigned_to = $1 AND status = 'delivered') as total_trips,
        (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE user_id = $1) as average_rating,
        (SELECT COUNT(*) FROM orders WHERE assigned_to = $1 AND DATE(created_at) = CURRENT_DATE) as today_trips,
        (SELECT COALESCE(SUM(amount), 0) FROM earnings WHERE user_id = $1 AND DATE(created_at) = CURRENT_DATE) as today_earnings
       FROM users WHERE id = $1`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};