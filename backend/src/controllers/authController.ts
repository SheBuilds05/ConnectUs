import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

// Register a new customer
export const registerCustomer = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, id_num } = req.body;
  const full_name = `${firstName} ${lastName}`;

  try {
    // Check if email exists in either table
    const existing = await pool.query(
      'SELECT email FROM users WHERE email = $1 UNION SELECT email FROM runnerprofile WHERE email = $1',
      [email]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if ID number already exists
    const idExists = await pool.query('SELECT * FROM users WHERE id_num = $1', [id_num]);
    if (idExists.rows.length > 0) {
      return res.status(400).json({ message: "ID number already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, id_num, role) 
       VALUES ($1, $2, $3, $4, 'customer') 
       RETURNING user_id, full_name, email, role`,
      [full_name, email, hashedPassword, id_num]
    );

    const token = jwt.sign(
      { 
        id: newUser.rows[0].user_id, 
        email: newUser.rows[0].email,
        role: 'customer',
        type: 'user'
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: newUser.rows[0]
    });
  } catch (err: any) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Register a new runner
export const registerRunner = async (req: Request, res: Response) => {
  const { 
    username, 
    email, 
    password, 
    phone, 
    address,
    city,
    postalCode,
    id_number,
    bio 
  } = req.body;

  try {
    // Check if email exists in either table
    const existing = await pool.query(
      'SELECT email FROM users WHERE email = $1 UNION SELECT email FROM runnerprofile WHERE email = $1',
      [email]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if username already exists
    const usernameExists = await pool.query(
      'SELECT * FROM runnerprofile WHERE username = $1',
      [username]
    );
    
    if (usernameExists.rows.length > 0) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newRunner = await pool.query(
      `INSERT INTO runnerprofile (
        username, email, password_hash, phone, address, city, 
        postal_code, id_document, bio, verification_status, 
        completed_bookings_count, id_verified, languages
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
      RETURNING runner_id, username, email, verification_status, city, profile_photo`,
      [username, email, hashedPassword, phone, address, city, 
       postalCode, id_number, bio, 'PENDING', 0, false, ARRAY['English']]
    );

    const token = jwt.sign(
      { 
        id: newRunner.rows[0].runner_id, 
        email: newRunner.rows[0].email,
        username: newRunner.rows[0].username,
        role: 'runner',
        type: 'runner'
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newRunner.rows[0].runner_id,
        name: newRunner.rows[0].username,
        email: newRunner.rows[0].email,
        role: 'runner',
        verification_status: newRunner.rows[0].verification_status
      }
    });
  } catch (err: any) {
    console.error("Runner Registration Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Login - checks both tables
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if it's a customer
    const customerResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (customerResult.rows.length > 0) {
      const user = customerResult.rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      
      if (isMatch) {
        const token = jwt.sign(
          { 
            id: user.user_id, 
            email: user.email,
            role: 'customer',
            type: 'user'
          },
          process.env.JWT_SECRET || 'secret',
          { expiresIn: '24h' }
        );

        return res.json({
          token,
          user: {
            id: user.user_id,
            name: user.full_name,
            email: user.email,
            role: 'customer'
          }
        });
      }
    }

    // Check if it's a runner
    const runnerResult = await pool.query(
      'SELECT * FROM runnerprofile WHERE email = $1',
      [email]
    );
    
    if (runnerResult.rows.length > 0) {
      const runner = runnerResult.rows[0];
      const isMatch = await bcrypt.compare(password, runner.password_hash);
      
      if (isMatch) {
        const token = jwt.sign(
          { 
            id: runner.runner_id, 
            email: runner.email,
            username: runner.username,
            role: 'runner',
            type: 'runner'
          },
          process.env.JWT_SECRET || 'secret',
          { expiresIn: '24h' }
        );

        return res.json({
          token,
          user: {
            id: runner.runner_id,
            name: runner.username,
            email: runner.email,
            role: 'runner',
            verification_status: runner.verification_status,
            city: runner.city,
            profile_photo: runner.profile_photo
          }
        });
      }
    }

    return res.status(400).json({ message: "Invalid email or password" });
    
  } catch (err: any) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Get current user profile
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    if (decoded.type === 'user') {
      // Customer
      const result = await pool.query(
        'SELECT user_id, full_name, email, role FROM users WHERE user_id = $1',
        [decoded.id]
      );
      return res.json(result.rows[0]);
    } else {
      // Runner
      const result = await pool.query(
        `SELECT runner_id as id, username as name, email, 'runner' as role, 
                verification_status, city, profile_photo, completed_bookings_count 
         FROM runnerprofile WHERE runner_id = $1`,
        [decoded.id]
      );
      return res.json(result.rows[0]);
    }
  } catch (err: any) {
    console.error("Error getting current user:", err.message);
    res.status(500).json({ error: err.message });
  }
};