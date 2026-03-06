import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    rating: number;
    total_trips: number;
    total_earnings: number;
    avatar_url: string | null;
    is_online: boolean;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Check for token in headers
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];
      
      if (!token) {
        res.status(401).json({ 
          success: false, 
          error: 'Not authorized, no token' 
        });
        return;
      }

      const secret = process.env.JWT_SECRET || 'fallback_secret';
      const decoded = jwt.verify(token, secret) as JwtPayload;

      const result = await query(
        `SELECT id, name, email, role, rating, total_trips, total_earnings, avatar_url, is_online 
         FROM users WHERE id = $1`,
        [decoded.id]
      );

      if (result.rows.length === 0) {
        res.status(401).json({ 
          success: false, 
          error: 'User not found' 
        });
        return;
      }

      req.user = result.rows[0];
      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({ 
        success: false, 
        error: 'Not authorized, token failed' 
      });
      return;
    }
  } else {
    res.status(401).json({ 
      success: false, 
      error: 'Not authorized, no token' 
    });
    return;
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        error: 'Not authorized' 
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
      });
      return;
    }

    next();
  };
};