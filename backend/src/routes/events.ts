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
  getEventsByUserId,
  checkEventOwnership,
  searchEvents,
  filterEvents
} from "../data/eventsStore";
import { validateBody } from "../middleware/validateBody";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

// POST/PUT body schema
const EventSchema = z.object({
  title: z.string().min(1),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), { 
    message: "Invalid date format" 
  }),
  location: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional().or(z.literal("")),
  volunteerPositions: z.array(z.string()).optional()
});

const EventUpdateSchema = EventSchema.partial()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided"
  });

/** GET /events → list all */
router.get("/", async (_req, res, next) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (e) {
    next(e);
  }
});

/** GET /events/search → search events */
router.get("/search", async (req, res, next) => {
  try {
    const searchTerm = req.query.q as string;
    if (!searchTerm) {
      return res.status(400).json({ error: "Search term is required" });
    }
    const results = await searchEvents(searchTerm);
    res.json(results);
  } catch (e) {
    next(e);
  }
});

/** GET /events/filter → filter events */
router.get("/filter", async (req, res, next) => {
  try {
    const results = await filterEvents({
      dateFrom: req.query.dateFrom as string | undefined,
      dateTo: req.query.dateTo as string | undefined,
      location: req.query.location as string | undefined
    });
    res.json(results);
  } catch (e) {
    next(e);
  }
});

/** GET /events/my → get current user's events */
router.get("/my", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const events = await getEventsByUserId(req.user!.id);
    res.json(events);
  } catch (e) {
    next(e);
  }
});

/** GET /events/:id → one by id */
router.get("/:id", async (req, res, next) => {
  try {
    const event = await getEventById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (e) {
    next(e);
  }
});

/** POST /events → create */
router.post(
  "/",
  requireAuth,
  validateBody(EventSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const event = await createEvent(req.body, req.user!.id);
      res.status(201).json(event);
    } catch (e) {
      next(e);
    }
  }
);

/** PATCH /events/:id → update */
router.patch(
  "/:id",
  requireAuth,
  validateBody(EventUpdateSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const isOwner = await checkEventOwnership(req.params.id, req.user!.id);
      if (!isOwner) {
        return res.status(403).json({ error: "You can only update your own events" });
      }

      const updated = await updateEventById(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Event not found" });
      res.json(updated);
    } catch (e) {
      next(e);
    }
  }
);

/** DELETE /events/:id → remove */
router.delete(
  "/:id",
  requireAuth,
  async (req: AuthenticatedRequest, res, next) => {
    try {
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
  }
);

export default router;