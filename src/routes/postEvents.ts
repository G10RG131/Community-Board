import { Router } from "express";
import { z } from "zod";
import { Event } from "../types/event";
import { events } from "../data/eventsStore";

// Zod schema for basic validation
const EventSchema = z.object({
  title: z.string().min(1),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), {
    message: "Invalid date format",
  }),
  location: z.string().min(1),
  description: z.string().optional(),
});

const router = Router();

/**
 * POST /events
 * Accepts an Event payload, validates it, 
 * assigns a unique id, stores it, and returns it.
 */
router.post("/", (req, res) => {
  const parsed = EventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  const newEvent: Event = {
    id: Date.now().toString(),
    ...parsed.data,
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
});

export default router;
