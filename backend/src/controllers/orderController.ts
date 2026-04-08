import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { query } from '../config/db';

export const getAvailableOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Schema: table is 'bookings', status is 'CREATED'
    const result = await query(
      `SELECT * FROM bookings 
       WHERE status = 'CREATED' 
       ORDER BY created_at DESC 
       LIMIT 20`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get available orders error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getActiveOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authorized' });
      return;
    }

    // Schema: 'runner_id' links to the runner, status matches Enum: 'ACCEPTED' or 'IN_PROGRESS'
    const result = await query(
      `SELECT * FROM bookings 
       WHERE runner_id = $1 AND status IN ('ACCEPTED', 'IN_PROGRESS')
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get active orders error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getCompletedOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authorized' });
      return;
    }

    // Schema: status 'COMPLETED'
    const result = await query(
      `SELECT * FROM bookings 
       WHERE runner_id = $1 AND status = 'COMPLETED'
       ORDER BY created_at DESC 
       LIMIT 20`,
      [userId]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get completed orders error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const acceptOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.id; 
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authorized' });
      return;
    }

    // Schema Check: Use 'booking_id' and 'CREATED' status
    const orderCheck = await query(
      'SELECT status FROM bookings WHERE booking_id = $1',
      [bookingId]
    );

    if (orderCheck.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    if (orderCheck.rows[0].status !== 'CREATED') {
      res.status(400).json({ success: false, error: 'Order is no longer available' });
      return;
    }

    // Schema: Update status to 'ACCEPTED' and set 'runner_id'
    const result = await query(
      `UPDATE bookings 
       SET status = 'ACCEPTED', 
           runner_id = $1, 
           updated_at = CURRENT_TIMESTAMP
       WHERE booking_id = $2 AND status = 'CREATED'
       RETURNING *`,
      [userId, bookingId]
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Order accepted successfully'
    });
  } catch (error) {
    console.error('Accept order error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body; 
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authorized' });
      return;
    }

    // Valid Enum values from image_9b4cc6.png
    const validStatuses = ['IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, error: 'Invalid status' });
      return;
    }

    const result = await query(
      `UPDATE bookings 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE booking_id = $2 AND runner_id = $3 
       RETURNING *`,
      [status, bookingId, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Order not found or not assigned to you' });
      return;
    }

    // If COMPLETED, record payment in the 'payments' table
    if (status === 'COMPLETED') {
        const order = result.rows[0];
        await query(
            `INSERT INTO payments (user_id, booking_id, amount, status)
             VALUES ($1, $2, $3, 'completed')`,
            [userId, bookingId, order.budget || 0]
        );
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: `Order status updated to ${status}`
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookingId = req.params.id;
    const result = await query(
      'SELECT * FROM bookings WHERE booking_id = $1',
      [bookingId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Order not found' });
      return;
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};