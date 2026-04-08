import { Request, Response } from 'express';
import pool from '../db';

/**
 * 0. FETCH PENDING ORDERS
 * Fetches orders with 'CREATED' status and joins user data for the UI
 */
export const getPendingOrders = async (req: Request, res: Response) => {
  try {
    console.log("Fetching pending orders...");
    const result = await pool.query(
      `SELECT 
        b.booking_id,
        b.user_id,
        b.status,
        b.budget,
        b.product_description,
        b.delivery_location,
        b.created_at,
        u.full_name as username
       FROM bookings b
       JOIN users u ON b.user_id = u.user_id
       WHERE b.status = 'CREATED' 
       ORDER BY b.created_at DESC`
    );
    
    console.log(`Successfully fetched ${result.rows.length} orders.`);
    res.json(result.rows);
  } catch (err: any) {
    console.error("Fetch Pending Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * 1. ACCEPT ORDER
 * Updates status to 'ACCEPTED' and assigns a runner_id
 */
export const acceptOrder = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { runnerId, purchaseDate, deliveryDate } = req.body;

  try {
    // Safety check: Max 5 deliveries per day
    const capCheck = await pool.query(
      `SELECT COUNT(*) FROM bookings 
       WHERE runner_id = $1 AND delivery_date = $2 AND status = 'ACCEPTED'`,
      [runnerId, deliveryDate]
    );

    if (parseInt(capCheck.rows[0].count) >= 5) {
      return res.status(400).json({ 
        error: "Safety Cap Reached: You already have 5 deliveries scheduled for this day." 
      });
    }

    const result = await pool.query(
      `UPDATE bookings 
       SET status = 'ACCEPTED', 
           runner_id = $1, 
           purchase_date = $2, 
           delivery_date = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE booking_id = $4
       RETURNING *`,
      [runnerId, purchaseDate, deliveryDate, bookingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ success: true, order: result.rows[0] });
  } catch (err: any) {
    console.error("Accept Order Error:", err.message);
    res.status(500).json({ error: "Failed to accept order" });
  }
};

/**
 * 2. REJECT ORDER
 */
export const rejectOrder = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  try {
    const result = await pool.query(
      `UPDATE bookings 
       SET status = 'REJECTED', updated_at = CURRENT_TIMESTAMP 
       WHERE booking_id = $1
       RETURNING *`,
      [bookingId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ success: true, message: "Order rejected" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to reject order" });
  }
};

/**
 * 3. GET ALL VERIFIED RUNNERS
 */
export const getRunners = async (req: Request, res: Response) => {
  try {
    const { city, limit = 20 } = req.query;
    let query = `
      SELECT 
        runner_id, username, email, completed_bookings_count, 
        verification_status, city, profile_photo, bio, languages, id_verified
      FROM runnerprofile
      WHERE verification_status = 'VERIFIED'
    `;
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (city) {
      query += ` AND city ILIKE $${paramIndex}`;
      queryParams.push(`%${city}%`);
      paramIndex++;
    }

    query += ` ORDER BY completed_bookings_count DESC LIMIT $${paramIndex}`;
    queryParams.push(limit);

    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 4. GET RUNNER BY ID
 */
export const getRunnerById = async (req: Request, res: Response) => {
  const { runnerId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM runnerprofile WHERE runner_id = $1`,
      [runnerId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Runner profile not found" });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
export const getRunnerProducts = async (req: Request, res: Response) => {
  const { runnerId } = req.params;
  try {
    const result = await pool.query(
      `SELECT product_id, runner_id, category_id, title, description, image_url, price 
       FROM products 
       WHERE runner_id = $1`,
      [runnerId]
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching runner products:', err.message);
    res.status(500).json({ error: err.message });
  }
};
// Update runner profile
export const updateRunnerProfile = async (req: Request, res: Response) => {
  const { runnerId } = req.params;
  const { bio, city, phone, profile_photo, languages } = req.body;
  try {
    const result = await pool.query(
      `UPDATE runnerprofile 
       SET bio = COALESCE($1, bio),
           city = COALESCE($2, city),
           phone = COALESCE($3, phone),
           profile_photo = COALESCE($4, profile_photo),
           languages = COALESCE($5, languages),
           updated_at = CURRENT_TIMESTAMP
       WHERE runner_id = $6
       RETURNING *`,
      [bio, city, phone, profile_photo, languages, runnerId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Runner profile not found" });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

/**
 * 6. GET RUNNER STATS
 */
export const getRunnerStats = async (req: Request, res: Response) => {
  const { runnerId } = req.params;
  try {
    const result = await pool.query(
      `SELECT completed_bookings_count, verification_status, id_verified, created_at as joined_date
       FROM runnerprofile WHERE runner_id = $1`,
      [runnerId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Runner stats not found" });
    }
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const getFullRunnerDashboard = async (req: Request, res: Response) => {
  const { runnerId } = req.params;

  try {
    // 1. Get Profile Info (Name, City, Wallet)
    const profile = await pool.query(
      `SELECT full_name, city, wallet_balance FROM users WHERE user_id = $1`,
      [runnerId]
    );

    // 2. Get Statistics (Total, Completed, Accepted)
    const stats = await pool.query(
      `SELECT 
        COUNT(*) as total_assigned,
        COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed,
        COUNT(*) FILTER (WHERE status = 'ACCEPTED') as active_missions
       FROM bookings 
       WHERE runner_id = $1`,
      [runnerId]
    );

    // 3. Get Recent Notifications
    const notifications = await pool.query(
      `SELECT message, created_at FROM notifications 
       WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5`,
      [runnerId]
    );

    const data = stats.rows[0];
    const total = parseInt(data.total_assigned);
    const completed = parseInt(data.completed);
    
    // Calculate Success Rate & Level
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const level = successRate >= 75 ? "PRO" : "JUNIOR";

    res.json({
      profile: profile.rows[0],
      stats: {
        totalTrips: total,
        completed,
        activeMissions: parseInt(data.active_missions),
        successRate,
        level
      },
      notifications: notifications.rows
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};