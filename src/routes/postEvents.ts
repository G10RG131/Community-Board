import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import type { Event } from "../types/event";
import { events } from "../data/eventsStore";

const router = Router();

const EventSchema = z.object({
  title: z.string().min(1),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), {
    message: "Invalid date format",
  }),
  location: z.string().min(1),
  description: z.string().optional(),
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  const parsed = EventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }
  const newEvent: Event = { id: Date.now().toString(), ...parsed.data };
  events.push(newEvent);
  return res.status(201).json(newEvent);
});

export default router;
