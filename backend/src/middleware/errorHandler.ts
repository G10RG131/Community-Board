// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Only log outside tests
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  // Zod validation errors → 400
  if (err instanceof ZodError) {
    // pick first error message
    const message = err.errors[0]?.message || "Invalid request";
    return res.status(400).json({ error: message });
  }

  // our own ApiError → its statusCode
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // fallback
  res.status(500).json({ error: "Internal server error" });
}
