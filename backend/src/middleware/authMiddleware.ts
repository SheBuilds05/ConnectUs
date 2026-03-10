import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken'; // If using JWT

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  // For now, we check a custom header. 
  // In production, you would verify a Bearer Token here.
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: No User ID provided" });
  }

  // Attach the user ID to the request object for controllers to use
  (req as any).user = { id: userId };
  next();
};