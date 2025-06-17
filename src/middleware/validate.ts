import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Given a Zod schema, return an Express middleware that
 * parses & validates req.body, or responds 400 on error.
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = (result.error as ZodError).format();
      return res.status(400).json({ error: errors });
    }
    // Replace body with the parsed & typed data
    req.body = result.data;
    next();
  };
}
