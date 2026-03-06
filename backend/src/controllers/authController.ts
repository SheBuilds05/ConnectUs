import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/db';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthRequest } from '../middleware/authMiddleware'; // ADD THIS IMPORT
import { User, UserCreate, UserResponse } from '../models/user';
dotenv.config();

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role = 'runner' } = req.body as RegisterBody;

    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      res.status(400).json({
        success: false,
        error: 'User already exists'
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await query(
      `INSERT INTO users (name, email, password_hash, role, is_online) 
       VALUES ($1, $2, $3, $4, true) 
       RETURNING id, name, email, role, rating, total_trips, total_earnings, avatar_url, is_online`,
      [name, email, password_hash, role]
    );

    const user = result.rows[0];

    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const expiresIn = process.env.JWT_EXPIRE || '7d';
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn } as jwt.SignOptions
    );

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginBody;

    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
      return;
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
      return;
    }

    await query(
      'UPDATE users SET is_online = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const expiresIn = process.env.JWT_EXPIRE || '7d';
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn } as jwt.SignOptions
    );

    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    if (userId) {
      await query(
        'UPDATE users SET is_online = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [userId]
      );
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during logout'
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // Cast to AuthRequest to access user property
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

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
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};