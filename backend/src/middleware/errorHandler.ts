// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);
  if (err instanceof ApiError) {
    // honor the statusCode & message you threw
    return res.status(err.statusCode).json({ error: err.message });
  }
  // fallback to generic 500
  res.status(500).json({ error: "Internal server error" });
}
