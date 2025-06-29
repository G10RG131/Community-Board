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

const router = Router();

// 🔐 protect all volunteer endpoints
router.use(requireAuth);

// —————————————————————————————
// payload validation schema
// —————————————————————————————
const VolunteerRegistrationSchema = z.object({
  eventId: z.string().uuid(),
  position: z.string().min(1),
});

// —————————————————————————————
// POST /volunteers/register
// —————————————————————————————
router.post(
  "/register",
  validateBody(VolunteerRegistrationSchema),              // validateBody wraps Zod :contentReference[oaicite:2]{index=2}
  asyncHandler(async (req, res) => {
    const { eventId, position } = req.body;
    const userId = (req as AuthenticatedRequest).user.id;

    // prevent duplicate sign-ups
    if (await isUserRegistered(eventId, userId, position)) {
      return res
        .status(400)
        .json({ error: "Already registered for this position" });
    }

    const registration = await registerVolunteer({ eventId, position }, userId);
    res.status(201).json(registration);
  })
);

// —————————————————————————————
// DELETE /volunteers/unregister
// —————————————————————————————
router.delete(
  "/unregister",
  validateBody(VolunteerRegistrationSchema),
  asyncHandler(async (req, res) => {
    const { eventId, position } = req.body;
    const userId = (req as AuthenticatedRequest).user.id;

    const success = await unregisterVolunteer(eventId, userId, position);
    if (!success) {
      return res.status(404).json({ error: "Registration not found" });
    }

    res.json({ message: "Unregistered successfully" });
  })
);

// —————————————————————————————
// GET /volunteers/:eventId
// —————————————————————————————
router.get(
  "/:eventId",
  asyncHandler(async (req, res) => {
    const list = await getVolunteersByEventId(req.params.eventId);
    res.json(list);
  })
);

// —————————————————————————————
// GET /volunteers/my-events
// —————————————————————————————
router.get(
  "/my-events",
  asyncHandler(async (req, res) => {
    const userId = (req as AuthenticatedRequest).user.id;
    const lists = await getVolunteersForUserEvents(userId);
    res.json(lists);
  })
);

export default router;
