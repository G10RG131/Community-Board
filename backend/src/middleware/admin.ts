// src/middleware/admin.ts
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";

/** Require authenticated user AND role === "admin" */
export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
