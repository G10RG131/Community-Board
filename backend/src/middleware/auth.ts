// src/middleware/auth.ts
import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

// Simple authentication middleware - in a real app you'd use JWT tokens
export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userHeader = req.headers['x-user-id'];
  const userNameHeader = req.headers['x-user-name'];
  const userEmailHeader = req.headers['x-user-email'];
  
  if (!userHeader || !userNameHeader || !userEmailHeader) {
    return res.status(401).json({ error: "Authentication required" });
  }
  
  req.user = {
    id: parseInt(userHeader as string),
    name: userNameHeader as string,
    email: userEmailHeader as string
  };
  
  next();
};

// Optional auth middleware - sets user if present but doesn't require it
export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userHeader = req.headers['x-user-id'];
  const userNameHeader = req.headers['x-user-name'];
  const userEmailHeader = req.headers['x-user-email'];
  
  if (userHeader && userNameHeader && userEmailHeader) {
    req.user = {
      id: parseInt(userHeader as string),
      name: userNameHeader as string,
      email: userEmailHeader as string
    };
  }
  
  next();
};
