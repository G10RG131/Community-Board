// src/routes/volunteers.ts
import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { validateBody } from "../middleware/validateBody";
import {
  registerVolunteer,
  unregisterVolunteer,
  getVolunteersByEventId,
  getVolunteersForUserEvents,
  isUserRegistered,
} from "../data/volunteerStore";
import { getEvents } from "../data/eventsStore";
import { nearbySearch, Place } from "../services/placesService";
import { config } from "../config";
import { ApiError } from "../utils/ApiError";

const router = Router();

// ── Public: search doesn’t require auth ────────────────────────────
router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const SearchSchema = z.object({
      lat: z
        .string()
        .refine((s) => !isNaN(Number(s)), { message: "lat must be a number" })
        .optional(),
      lng: z
        .string()
        .refine((s) => !isNaN(Number(s)), { message: "lng must be a number" })
        .optional(),
      radius: z
        .string()
        .refine((s) => !isNaN(Number(s)), { message: "radius must be a number" })
        .optional()
        .default("500"),
      date: z.string().optional(),
      tags: z.string().optional(), // comma-separated
    });
    const { lat, lng, radius, date, tags } = SearchSchema.parse(req.query);

    let places: Place[] = [];
    if (lat && lng) {
      if (!config.googleApiKey) {
        throw new ApiError(500, "Google API key not configured");
      }
      places = await nearbySearch(Number(lat), Number(lng), Number(radius));
    }

    let events = await getEvents();
    if (date) {
      events = events.filter((e) => e.date.startsWith(date));
    }
    if (tags) {
      const tagList = tags.split(",");
      events = events.filter((e) =>
        tagList.every((t) => e.volunteerPositions.includes(t))
      );
    }

    res.json({ places, events });
  })
);

// ── All other volunteer endpoints require auth ───────────────────────
router.use(requireAuth);

const VolunteerRegistrationSchema = z.object({
  eventId: z.string().uuid(),
  position: z.string().min(1),
});

// POST /volunteers/register
router.post(
  "/register",
  validateBody(VolunteerRegistrationSchema),
  asyncHandler(async (req, res) => {
    const { eventId, position } = req.body;
    const userId = (req as AuthenticatedRequest).user.id;

    if (await isUserRegistered(eventId, userId, position)) {
      throw new ApiError(400, "Already registered for this position");
    }

    const registration = await registerVolunteer({ eventId, position }, userId);
    res.status(201).json(registration);
  })
);

// DELETE /volunteers/unregister
router.delete(
  "/unregister",
  validateBody(VolunteerRegistrationSchema),
  asyncHandler(async (req, res) => {
    const { eventId, position } = req.body;
    const userId = (req as AuthenticatedRequest).user.id;

    const success = await unregisterVolunteer(eventId, userId, position);
    if (!success) {
      throw new ApiError(404, "Registration not found");
    }

    res.json({ message: "Unregistered successfully" });
  })
);

// GET /volunteers/:eventId
router.get(
  "/:eventId",
  asyncHandler(async (req, res) => {
    const list = await getVolunteersByEventId(req.params.eventId);
    res.json(list);
  })
);

// GET /volunteers/my-events
router.get(
  "/my-events",
  asyncHandler(async (req, res) => {
    const userId = (req as AuthenticatedRequest).user.id;
    const lists = await getVolunteersForUserEvents(userId);
    res.json(lists);
  })
);

export default router;
