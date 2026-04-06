import { Request, Response, NextFunction } from 'express';

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: No User ID provided" });
  }

  // Attach the user ID to the request object
  (req as any).user = { id: userId };
  next();
};
