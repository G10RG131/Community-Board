import { Request, Response, NextFunction } from "express";

/**
 * Final error handler: any error passed to next(err)
 * ends up here, with a 500 JSON response.
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
