// src/middleware/validateBody.ts
import { RequestHandler } from "express";
import { ZodSchema } from "zod";

/**
 * Validates req.body against a Zod schema,
 * returns 400 + field errors if invalid,
 * otherwise replaces req.body with the parsed data.
 */
export function validateBody<T>(schema: ZodSchema<T>): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.format() });
    }
    req.body = result.data;
    next();
  };
}
