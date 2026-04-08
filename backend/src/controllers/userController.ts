import { Request, Response } from 'express';
import pool from '../db';

/**
 * 1. CREATE NEW BOOKING
 * Triggered by handlePayment in UserBookings.tsx
 */
export const createBooking = async (req: Request, res: Response) => {
  const user_id = (req as any).user?.id;
  const { product_description, delivery_location, budget, is_priority, runner_id } = req.body;
  
  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Ensure status is uppercase 'CREATED' to match your Enum
    const finalStatus = status ? status.toUpperCase() : 'CREATED';
    
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
 * 2. FETCH ALL BOOKINGS (For User History)
 * Fixed: Changed assigned_runner_id to runner_id to match your schema
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
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

/**
 * 3. GET USER PROFILE
 */
export const getUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT full_name, email, profile_pic, notifications FROM users WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

/**
 * 4. UPDATE USER PROFILE
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
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

/**
 * 5. GET BOOKING STATUS
 * For tracking functionality
 */
export const getBookingStatus = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  try {
    const result = await pool.query(
      'SELECT status, product_description, delivery_location FROM bookings WHERE booking_id = $1',
      [bookingId]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: "Tracking failed" });
  }
};

/**
 * 6. CANCEL BOOKING
 * For cancelling existing bookings
 */
export const cancelBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  try {
    await pool.query(
      "UPDATE bookings SET status = 'CANCELED' WHERE booking_id = $1",
      [bookingId]
    );
    res.json({ message: "Booking canceled successfully" });
  } catch (err: any) {
    res.status(500).json({ error: "Cancellation failed" });
  }
};

/**
 * 7. GET WALLET DATA
 * Fetches wallet balance and transaction history
 */
export const getWallet = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const balanceResult = await pool.query(
      'SELECT wallet_balance FROM users WHERE user_id = $1',
      [userId]
    );

    const txResult = await pool.query(
      `SELECT 
        transaction_id as id,
        type,
        amount,
        description,
        status,
        TO_CHAR(created_at, 'YYYY-MM-DD') as date
       FROM wallet_transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [userId]
    );

    res.json({
      balance: parseFloat(balanceResult.rows[0]?.wallet_balance ?? 0),
      currency: 'ZAR',
      transactions: txResult.rows
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch wallet', details: err.message });
  }
};

/**
 * 8. TOP UP WALLET
 * Adds funds to user's wallet
 */
export const topUpWallet = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { amount } = req.body;

  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const updated = await client.query(
      `UPDATE users 
       SET wallet_balance = wallet_balance + $1 
       WHERE user_id = $2 
       RETURNING wallet_balance`,
      [parseFloat(amount), userId]
    );

    await client.query(
      `INSERT INTO wallet_transactions (user_id, type, amount, description, status)
       VALUES ($1, 'credit', $2, 'Wallet top-up', 'completed')`,
      [userId, parseFloat(amount)]
    );

    await client.query('COMMIT');

    res.json({
      balance: parseFloat(updated.rows[0].wallet_balance),
      message: `R${amount} added successfully`
    });
  } catch (err: any) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Top-up failed', details: err.message });
  } finally {
    client.release();
  }
};

/**
 * 9. WITHDRAW FUNDS FROM WALLET
 * Deducts funds from user's wallet and records as debit transaction
 */
export const withdrawFunds = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { amount } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Check balance first
    const checkRes = await client.query(
      'SELECT wallet_balance FROM users WHERE user_id = $1',
      [userId]
    );
    
    if (!checkRes.rows[0]) {
      throw new Error("User not found");
    }
    
    if (parseFloat(checkRes.rows[0].wallet_balance) < parseFloat(amount)) {
      throw new Error("Insufficient funds");
    }

    // 2. Subtract from balance
    const updateRes = await client.query(
      'UPDATE users SET wallet_balance = wallet_balance - $1 WHERE user_id = $2 RETURNING wallet_balance',
      [parseFloat(amount), userId]
    );

    // 3. Record as 'debit'
    await client.query(
      `INSERT INTO wallet_transactions (user_id, type, amount, description, status) 
       VALUES ($1, 'debit', $2, $3, $4)`,
      [userId, parseFloat(amount), 'Withdrawal', 'completed']
    );

    await client.query('COMMIT');
    res.json({ 
      newBalance: parseFloat(updateRes.rows[0].wallet_balance),
      message: `R${amount} withdrawn successfully`
    });
  } catch (err: any) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
};
/**
 * 10. GET SINGLE RUNNER BY ID
 */
export const getRunnerById = async (req: Request, res: Response) => {
  const { runnerId } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT 
        u.user_id as runner_id,
        u.full_name as username,
        u.email,
        u.phone,
        u.created_at as joined_date,
        rp.completed_bookings_count,
        rp.verification_status,
        rp.is_blocked
       FROM users u
       LEFT JOIN runnerprofile rp ON u.user_id = rp.runner_id
       WHERE u.user_id = $1 AND u.role = 'runner'`,
      [runnerId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Runner not found' });
    }
    
    const runner = result.rows[0];
    
    // Get runner's recent reviews
    const reviewsResult = await pool.query(
      `SELECT 
        r.rating,
        r.comment,
        r.created_at,
        u.full_name as customer_name
       FROM reviews r
       JOIN users u ON r.customer_id = u.user_id
       WHERE r.runner_id = $1
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [runnerId]
    );
    
    res.json({
      ...runner,
      rating: 4.9, // Calculate from reviews or set default
      reviews: reviewsResult.rows,
      city: 'Sandton, Johannesburg', // You can derive this from location data
      avatar: null,
      bio: `Professional runner with ${runner.completed_bookings_count || 0} successful deliveries.`
    });
  } catch (err: any) {
    console.error('Error fetching runner:', err.message);
    res.status(500).json({ error: 'Failed to fetch runner details' });
  }
};