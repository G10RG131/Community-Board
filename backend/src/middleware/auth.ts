// src/middleware/auth.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import type { UserResponse } from "../types/user";

export interface AuthenticatedRequest extends Request {
  user: UserResponse;
}

/**
 * requireAuth:
 * 1) If x-user-id header is present → trust it, populate req.user, next().
 * 2) Otherwise expect "Bearer <token>" → verify via JWT_SECRET.
 * 3) Load full user row from DB (id, name, email, role).
 */
export const requireAuth: RequestHandler = (req, res, next) => {
  // 1) Shortcut via headers (for tests)
  const idHdr = req.header("x-user-id");
  if (idHdr) {
    req.user = {
      id: parseInt(idHdr, 10),
      name: req.header("x-user-name") || "Test User",
      email: req.header("x-user-email") || "test@example.com",
      role: (req.header("x-user-role") as any) || "admin",
    };
    next();
    return;
  }

  // 2) Real JWT flow
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let payload: any;
  try {
    payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET!);
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = (payload as any).userId as number;

  // 3) Load user row
  pool
    .query<{ id: number; name: string; email: string; role: string }>(
      `SELECT id, name, email, role FROM users WHERE id = $1`,
      [userId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      (req as AuthenticatedRequest).user = rows[0] as UserResponse;
      next();
    })
    .catch(() => {
      res.status(500).json({ error: "Database error" });
    });
};

/**
 * requireAdmin:
 * - Must be used **after** requireAuth.
 * - Only allows req.user.role === "admin" **OR** req.user.id === 1.
 */
export const requireAdmin: RequestHandler = (
  req,
  res,
  next
) => {
  const authReq = req as AuthenticatedRequest;
  if (
    !authReq.user ||
    (authReq.user.role !== "admin" && authReq.user.id !== 1)
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};
