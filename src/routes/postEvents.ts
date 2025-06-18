// src/routes/postEvents.ts
import { Router } from "express";
import { z } from "zod";
import type { Event } from "../types/event";
import { createEvent } from "../data/eventsStore";
import { validateBody } from "../middleware/validateBody";

const router = Router();

// Zod schema for validating incoming event data
const EventSchema = z.object({
  title:       z.string().min(1),
  date:        z.string().refine((d) => !isNaN(Date.parse(d)), { message: "Invalid date format" }),
  location:    z.string().min(1),
  description: z.string().optional(),
});

/**
 * POST /events
 *  - Validates the body against EventSchema
 *  - Inserts the new event into Postgres
 *  - Returns the created row
 */
router.post(
  "/",
  validateBody(EventSchema),
  async (req, res, next) => {
    try {
      const created = await createEvent(req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
