import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Define and export the interface the controllers are looking for
export interface AuthRequest extends Request {
  user?: {
    id: string | number;
  };
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') return next();

  // Try Bearer token first
  const authHeader = req.headers['authorization'];
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key_here') as any;
      
      // 2. Now we can assign to req.user safely
      req.user = { id: decoded.id || decoded.userId || decoded.user_id || decoded.sub };
      return next();
    } catch (err) {
      console.log('Invalid token:', err);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  }

  // Fall back to x-user-id
  const userId = req.headers['x-user-id'] as string;
  if (userId) {
    req.user = { id: userId };
    return next();
  }

  console.log('Blocked: No auth provided');
  return res.status(401).json({ error: 'Unauthorized: No credentials provided' });
};

export { authenticateUser as protect };
