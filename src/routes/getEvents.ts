import { Router } from "express";
import {
  getEvents,
  getEventById,
  deleteEventById,
  updateEventById
} from "../data/eventsStore";

import type { Event } from "../types/event";

const router = Router();

/** GET /events – list all events */
router.get("/", async (_req, res, next) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (err) {
    next(err);
  }
});

/** GET /events/:id – fetch a single event by ID */
router.get("/:id", async (req, res, next) => {
  try {
    const event = await getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    next(err);
  }
});

/** DELETE /events/:id – remove an event by ID */
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await deleteEventById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /events/:id – partially update an event.
 */
router.patch("/:id", async (req, res, next) => {
    const updates = req.body as Partial<Omit<Event, "id">>;
    try {
      const updated = await updateEventById(req.params.id, updates);
      if (!updated) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

export default router;
