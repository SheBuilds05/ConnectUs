import { Request, Response } from 'express';
import pool from '../db';

// Create a new booking
export const createBooking = async (req: Request, res: Response) => {
  const {
    user_id,
    runner_id,
    product_description,
    delivery_location,
    budget,
    product_image_url,
    scheduled_for,
    special_instructions,
    status
  } = req.body;

  // Log the incoming request for debugging
  console.log('📝 Creating booking with data:', {
    user_id,
    runner_id: runner_id || 'null (will be assigned later)',
    product_description,
    delivery_location,
    budget,
  });

  // Validate required fields
  if (!user_id) {
    return res.status(400).json({ success: false, error: 'user_id is required' });
  }
  if (!product_description) {
    return res.status(400).json({ success: false, error: 'product_description is required' });
  }
  if (!delivery_location) {
    return res.status(400).json({ success: false, error: 'delivery_location is required' });
  }
  if (!budget || budget <= 0) {
    return res.status(400).json({ success: false, error: 'budget is required and must be greater than 0' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings (
        user_id, 
        runner_id, 
        product_description, 
        delivery_location, 
        budget, 
        product_image_url, 
        scheduled_for, 
        special_instructions, 
        status, 
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING booking_id, user_id, runner_id, status, product_description, delivery_location, budget, created_at`,
      [
        user_id, 
        runner_id || null,  // Allow null runner_id
        product_description, 
        delivery_location, 
        budget, 
        product_image_url || null, 
        scheduled_for || null, 
        special_instructions || null, 
        status || 'CREATED'
      ]
    );

    console.log('✅ Booking created successfully:', result.rows[0]);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('❌ Error creating booking:', error);
    
    // Check for foreign key constraint errors
    if (error.code === '23503') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid runner_id. The specified runner does not exist.' 
      });
    }
    
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get bookings for a user
export const getUserBookings = async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ success: false, error: 'userId is required' });
  }
  
  try {
    const result = await pool.query(
      `SELECT b.*, 
        r.username as runner_name, 
        r.profile_photo as runner_avatar,
        r.phone as runner_phone
      FROM bookings b
      LEFT JOIN runnerprofile r ON b.runner_id = r.runner_id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC`,
      [userId]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get booking by ID
export const getBookingById = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  
  if (!bookingId) {
    return res.status(400).json({ success: false, error: 'bookingId is required' });
  }
  
  try {
    const result = await pool.query(
      `SELECT b.*, 
        r.username as runner_name, 
        r.phone as runner_phone, 
        r.profile_photo as runner_avatar
      FROM bookings b
      LEFT JOIN runnerprofile r ON b.runner_id = r.runner_id
      WHERE b.booking_id = $1`,
      [bookingId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('Error fetching booking by ID:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update booking status
export const updateBookingStatus = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  
  if (!bookingId) {
    return res.status(400).json({ success: false, error: 'bookingId is required' });
  }
  
  if (!status) {
    return res.status(400).json({ success: false, error: 'status is required' });
  }
  
  const validStatuses = ['CREATED', 'ACCEPTED', 'PURCHASING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status value' });
  }
  
  try {
    const result = await pool.query(
      `UPDATE bookings 
       SET status = $1, updated_at = NOW() 
       WHERE booking_id = $2
       RETURNING *`,
      [status, bookingId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    
    res.json({ success: true, message: 'Booking status updated', data: result.rows[0] });
  } catch (error: any) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all bookings (for admin)
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT b.*, 
        r.username as runner_name
      FROM bookings b
      LEFT JOIN runnerprofile r ON b.runner_id = r.runner_id
      ORDER BY b.created_at DESC`
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Assign a runner to a booking
export const assignRunnerToBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { runner_id } = req.body;
  
  if (!bookingId || !runner_id) {
    return res.status(400).json({ success: false, error: 'bookingId and runner_id are required' });
  }
  
  try {
    // Check if runner exists
    const runnerCheck = await pool.query(
      'SELECT runner_id FROM runnerprofile WHERE runner_id = $1',
      [runner_id]
    );
    
    if (runnerCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Runner not found' });
    }
    
    const result = await pool.query(
      `UPDATE bookings 
       SET runner_id = $1, updated_at = NOW() 
       WHERE booking_id = $2
       RETURNING *`,
      [runner_id, bookingId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    
    res.json({ success: true, message: 'Runner assigned successfully', data: result.rows[0] });
  } catch (error: any) {
    console.error('Error assigning runner to booking:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};