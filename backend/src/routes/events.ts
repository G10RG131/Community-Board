// src/routes/events.ts
import { Router, RequestHandler } from "express";
import { z } from "zod";
import type { Event } from "../types/event";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEventById,
  deleteEventById,
  getEventsByUserId,
  checkEventOwnership,
} from "../data/eventsStore";
import { validateBody } from "../middleware/validateBody";
import { requireAuth, optionalAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// POST/PUT body schema
const EventSchema = z.object({
  title: z.string().min(1),
  date: z
    .string()
    .refine((d) => !isNaN(Date.parse(d)), { message: "Invalid date format" }),
  location: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional().or(z.literal("")), // Allow empty string or valid string
  volunteerPositions: z.array(z.string()).optional(),
});

const EventUpdateSchema = EventSchema.partial()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
  });

/** GET  /events       → list all */
router.get("/", async (_req, res, next) => {
  try {
    const all = await getEvents();
    res.json(all);
  } catch (e) {
    next(e);
  }
});

/** GET  /events/my    → get current user's events */
router.get("/my", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userEvents = await getEventsByUserId(req.user!.id);
    res.json(userEvents);
  } catch (e) {
    next(e);
  }
});

/** GET  /events/:id   → one by id */
router.get("/:id", async (req, res, next) => {
  try {
    const ev = await getEventById(req.params.id);
    if (!ev) return res.status(404).json({ error: "Event not found" });
    res.json(ev);
  } catch (e) {
    next(e);
  }
});

/** POST /events       → create */
router.post(
  "/",
  requireAuth,
  validateBody(EventSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const created = await createEvent(req.body as Event, req.user!.id);
      res.status(201).json(created);
    } catch (e) {
      next(e);
    }
  }
);

/** PATCH /events/:id  → update */
router.patch(
  "/:id",
  requireAuth,
  validateBody(EventUpdateSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      // Check if user owns the event
      const isOwner = await checkEventOwnership(req.params.id, req.user!.id);
      if (!isOwner) {
        return res.status(403).json({ error: "You can only update your own events" });
      }

      const updated = await updateEventById(
        req.params.id,
        req.body as Partial<Omit<Event, "id">>
      );
      if (!updated) return res.status(404).json({ error: "Event not found" });
      res.json(updated);
    } catch (e) {
      next(e);
    }
  }
);

/** DELETE /events/:id → remove */
router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    // Check if user owns the event
    const isOwner = await checkEventOwnership(req.params.id, req.user!.id);
    if (!isOwner) {
      return res.status(403).json({ error: "You can only delete your own events" });
    }

    const deleted = await deleteEventById(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.json(deleted);
  } catch (e) {
    next(e);
  }
});

export default router;
