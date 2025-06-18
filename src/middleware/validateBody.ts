// src/middleware/validateBody.ts
import { RequestHandler } from "express";
import type { ZodSchema } from "zod";

/**
 * Given a Zod schema, returns middleware that:
 *  - safeParses req.body
 *  - on failure: 400 + formatted field-errors
 *  - on success: replaces req.body with parsed data
 */
export const validateBody =
  <T>(schema: ZodSchema<T>): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.format() });
    }
    req.body = result.data;
    next();
  };
