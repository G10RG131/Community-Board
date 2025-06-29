// src/routes/events.ts
import { Router } from "express";
import { z } from "zod";
import type { Event } from "../types/event";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEventById,
  deleteEventById,
} from "../data/eventsStore";
import { validateBody } from "../middleware/validateBody";

const router = Router();

// POST/PUT body schema
const EventSchema = z.object({
  title: z.string().min(1),
  date: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), { message: "Invalid date format" }),
  location: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional().or(z.literal("")),
  volunteerPositions: z.array(z.string()).optional(),
});

const EventUpdateSchema = EventSchema.partial().refine(
  (obj) => Object.keys(obj).length > 0,
  { message: "At least one field must be provided" }
);

/** GET  /events       → list all */
router.get("/", async (_req, res, next) => {
  try {
    const all = await getEvents();
    res.json(all);
  } catch (err) {
    next(err);
  }
});

/** GET  /events/:id   → one by id */
router.get("/:id", async (req, res, next) => {
  try {
    const ev = await getEventById(req.params.id);
    if (!ev) return res.status(404).json({ error: "Event not found" });
    res.json(ev);
  } catch (err) {
    next(err);
  }
});

/** POST /events       → create */
router.post(
  "/",
  validateBody(EventSchema),
  async (req, res, next) => {
    try {
      const created = await createEvent(req.body as Event);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }
);

/** PATCH /events/:id  → update */
router.patch(
  "/:id",
  validateBody(EventUpdateSchema),
  async (req, res, next) => {
    try {
      const updated = await updateEventById(
        req.params.id,
        req.body as Partial<Omit<Event, "id">>
      );
      if (!updated) return res.status(404).json({ error: "Event not found" });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

/** DELETE /events/:id → remove */
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await deleteEventById(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

export default router;
