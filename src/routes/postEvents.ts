// src/routes/postEvents.ts
import { Router, RequestHandler } from "express";
import { z } from "zod";
import { pool } from "../db";

const router = Router();

// validate incoming payload
const EventSchema = z.object({
  title: z.string().min(1),
  date: z.string().refine(d => !isNaN(Date.parse(d)), { message: "Invalid date format" }),
  location: z.string().min(1),
  description: z.string().optional(),
});

const postEventsHandler: RequestHandler = async (req, res, next) => {
  const parsed = EventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  try {
    const { title, date, location, description } = parsed.data;
    // INSERT ... RETURNING * to get the full row back
    const { rows } = await pool.query(
      `INSERT INTO events (id, title, date, location, description)
       VALUES (gen_random_uuid(), $1, $2, $3, $4)
       RETURNING id, title, date, location, description`,
      [title, date, location, description]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

router.post("/", postEventsHandler);
export default router;
