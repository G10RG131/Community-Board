// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;                // now includes role
  };
}

/**
 * Require header‐based auth (x-user-*) and populate req.user.
 */
export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const id = req.header('x-user-id');
  const name = req.header('x-user-name');
  const email = req.header('x-user-email');
  const role = req.header('x-user-role');
  if (!id || !name || !email || !role) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.user = {
    id: Number(id),
    name,
    email,
    role
  };
  next();
};

/**
 * Allow optional authentication; sets req.user if headers present.
 */
export const optionalAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const id = req.header('x-user-id');
  const name = req.header('x-user-name');
  const email = req.header('x-user-email');
  const role = req.header('x-user-role');
  if (id && name && email && role) {
    req.user = {
      id: Number(id),
      name,
      email,
      role
    };
  }
  next();
};

/**
 * Only allow users with role 'admin'.
 */
export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  next();
};
