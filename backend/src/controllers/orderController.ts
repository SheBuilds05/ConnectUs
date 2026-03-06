import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { query } from '../config/db';

export const getAvailableOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await query(
      `SELECT * FROM orders 
       WHERE status = 'available' 
       ORDER BY created_at DESC 
       LIMIT 20`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get available orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

export const getActiveOrders = async (req: AuthRequest, res: Response): Promise<void> => {
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
      `SELECT * FROM orders 
       WHERE assigned_to = $1 AND status IN ('accepted', 'picking-up', 'delivering')
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get active orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

export const getCompletedOrders = async (req: AuthRequest, res: Response): Promise<void> => {
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
      `SELECT * FROM orders 
       WHERE assigned_to = $1 AND status = 'delivered'
       ORDER BY delivered_at DESC 
       LIMIT 20`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get completed orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

export const acceptOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
      return;
    }

    // Check if order exists and is available
    const orderCheck = await query(
      'SELECT status FROM orders WHERE id = $1',
      [orderId]
    );

    if (orderCheck.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    if (orderCheck.rows[0].status !== 'available') {
      res.status(400).json({
        success: false,
        error: 'Order is no longer available'
      });
      return;
    }

    // Accept order
    const result = await query(
      `UPDATE orders 
       SET status = 'accepted', 
           assigned_to = $1, 
           assigned_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND status = 'available'
       RETURNING *`,
      [userId, orderId]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Order accepted successfully'
    });
  } catch (error) {
    console.error('Accept order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
      return;
    }

    const validStatuses = ['picking-up', 'delivering', 'delivered'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
      return;
    }

    let updateQuery = 'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP';
    const params: any[] = [status];

    // Add timestamp based on status
    if (status === 'picking-up') {
      updateQuery += ', picked_up_at = CURRENT_TIMESTAMP';
    } else if (status === 'delivered') {
      updateQuery += ', delivered_at = CURRENT_TIMESTAMP';
    }

    updateQuery += ' WHERE id = $2 AND assigned_to = $3 RETURNING *';
    params.push(orderId, userId);

    const result = await query(updateQuery, params);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Order not found or not assigned to you'
      });
      return;
    }

    // If delivered, update runner stats and add earnings
    if (status === 'delivered') {
      const order = result.rows[0];
      
      await query(
        `UPDATE users 
         SET total_trips = total_trips + 1,
             total_earnings = total_earnings + $1
         WHERE id = $2`,
        [order.payout, userId]
      );

      await query(
        `INSERT INTO earnings (user_id, order_id, amount, type, status)
         VALUES ($1, $2, $3, 'order', 'completed')`,
        [userId, orderId, order.payout]
      );
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: `Order status updated to ${status}`
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id;

    const result = await query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};