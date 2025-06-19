// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

/**
 * Catches anything passed to next(err)
 * and returns a 500 JSON.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
