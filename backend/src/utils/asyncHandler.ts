// src/utils/asyncHandler.ts
import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async route handler and forwards any error to next(err).
 */
export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
