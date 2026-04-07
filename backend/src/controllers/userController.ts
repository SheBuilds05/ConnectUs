import { Request, Response } from 'express';
import pool from '../db';

/**
 * 1. CREATE NEW BOOKING
 * Triggered by handlePayment in UserBookings.tsx
 */
export const createBooking = async (req: Request, res: Response) => {
  const user_id = (req as any).user?.id;
  const { product_description, delivery_location, budget, is_priority,runner_id } = req.body;
  
  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings (user_id, product_description, delivery_location, budget, status, runner_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, product_description, delivery_location, budget, 'CREATED', runner_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error('Create booking error:', err.message);
    res.status(500).json({ error: 'Failed to create booking', details: err.message });
  }
};

/**
 * 2. FETCH ALL BOOKINGS
 * Updated to include runner object structure for UserTrackOrder.tsx
 */
export const getUserBookings = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        b.booking_id as id, 
        b.status, 
        b.product_description, 
        b.delivery_location, 
        b.created_at,
        u.full_name as runner_name, 
        u.phone as runner_phone
       FROM bookings b 
       LEFT JOIN users u ON b.runner_id = u.user_id 
       WHERE b.user_id = $1 
       ORDER BY b.created_at DESC`,
      [userId]
    );

    const formattedBookings = result.rows.map(row => ({
  id: row.id,
  status: row.status,
  product_description: row.product_description,
  delivery_location: row.delivery_location,
  created_at: row.created_at,
  runner: row.runner_name ? {
    name: row.runner_name,
    phone: row.runner_phone,
    // Use the name as the seed so the avatar is unique to that runner
    avatar: row.runner_name.replace(/\s+/g, '').toLowerCase() 
  } : null
}));

    res.json(formattedBookings);
  } catch (error: any) {
    console.error("DATABASE ERROR:", error.message);
    res.status(500).json({ error: "Failed to fetch bookings", details: error.message });
  }
};

/**
 * 3. GET USER PROFILE
 * Loads initial data for UserSettings.tsx
 */
export const getUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT full_name, email, profile_pic, notifications FROM users WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

/**
 * 4. UPDATE USER PROFILE
 * Handles updates from UserSettings.tsx
 */
export const updateUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { full_name, email, notifications } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users 
       SET full_name = $1, email = $2, notifications = $3 
       WHERE user_id = $4 
       RETURNING *`,
      [full_name, email, JSON.stringify(notifications), userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Existing Tracking Logic
export const getBookingStatus = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  try {
    const result = await pool.query(
      'SELECT status, product_description, delivery_location FROM bookings WHERE booking_id = $1',
      [bookingId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Tracking failed" });
  }
};

// Existing Cancellation Logic
export const cancelBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  try {
    await pool.query(
      "UPDATE bookings SET status = 'CANCELED' WHERE booking_id = $1",
      [bookingId]
    );
    res.json({ message: "Booking canceled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Cancellation failed" });
  }
};