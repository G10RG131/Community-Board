import { Router } from "express";
import { z } from "zod";
import {
  getEvents,
  getEventById,
  deleteEventById,
  updateEventById
} from "../data/eventsStore";
import { validateBody } from "../middleware/validate";
import type { Event } from "../types/event";

const router = Router();

// Zod schema for validating PATCH request bodies (all fields optional) and ensuring at least one field
const EventUpdateSchema = z
  .object({
    title:       z.string().min(1).optional(),
    date:        z
      .string()
      .refine((d) => !isNaN(Date.parse(d)), { message: "Invalid date format" })
      .optional(),
    location:    z.string().min(1).optional(),
    description: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

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
 * PATCH /events/:id – partially update an event with validation
 */
router.patch(
  "/:id",
  validateBody(EventUpdateSchema),
  async (req, res, next) => {
    try {
      const updated = await updateEventById(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
