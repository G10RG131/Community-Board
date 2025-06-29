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
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

const router = Router();

// body schema for create/update
const EventSchema = z
  .object({
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

// GET /events → list all
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const all = await getEvents();
    res.json(all);
  })
);

// GET /events/:id → one by id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const ev = await getEventById(req.params.id);
    if (!ev) throw new ApiError(404, "Event not found");
    res.json(ev);
  })
);

// POST /events → create
router.post(
  "/",
  validateBody(EventSchema),
  asyncHandler(async (req, res) => {
    const created = await createEvent(req.body as Event);
    res.status(201).json(created);
  })
);

// PATCH /events/:id → update
router.patch(
  "/:id",
  validateBody(EventUpdateSchema),
  asyncHandler(async (req, res) => {
    const updated = await updateEventById(
      req.params.id,
      req.body as Partial<Omit<Event, "id">>
    );
    if (!updated) throw new ApiError(404, "Event not found");
    res.json(updated);
  })
);

// DELETE /events/:id → remove
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await deleteEventById(req.params.id);
    if (!deleted) throw new ApiError(404, "Event not found");
    res.json(deleted);
  })
);

export default router;
