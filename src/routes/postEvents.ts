// src/routes/postEvents.ts

import { Router, RequestHandler } from "express";
import { z } from "zod";
import type { Event } from "../types/event";
import { events } from "../data/eventsStore";

const router = Router();

// Zod schema for validating incoming event data
const EventSchema = z.object({
  title: z.string().min(1),
  date: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), { message: "Invalid date format" }),
  location: z.string().min(1),
  description: z.string().optional(),
});

/**
 * Handler for POST /events
 * - Validates the body against EventSchema
 * - Assigns a unique ID
 * - Stores the new event in memory
 */
const postEventsHandler: RequestHandler = (req, res) => {
  // Validate request body
  const parsed = EventSchema.safeParse(req.body);
  if (!parsed.success) {
    // NOTE: no `return` here
    res.status(400).json({ error: parsed.error.format() });
    return;
  }

  // Build new event with a unique ID
  const newEvent: Event = {
    id: Date.now().toString(),
    ...parsed.data,
  };

  // Store and respond
  events.push(newEvent);
  // NOTE: no `return` here
  res.status(201).json(newEvent);
};

router.post("/", postEventsHandler);

export default router;
