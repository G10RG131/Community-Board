// src/routes/volunteers.ts
import { Router } from "express";
import { z } from "zod";
import {
  registerVolunteer,
  getVolunteersByEventId,
  getVolunteersForUserEvents,
  unregisterVolunteer,
  isUserRegistered
} from "../data/volunteerStore";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { validateBody } from "../middleware/validateBody";

const router = Router();

// Volunteer registration schema
const VolunteerRegistrationSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
  position: z.string().min(1, "Position is required")
});

/** POST /volunteers/register → Register as volunteer for a position */
router.post(
  "/register",
  requireAuth,
  validateBody(VolunteerRegistrationSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { eventId, position } = req.body;
      const userId = req.user!.id;

      // Check if user is already registered for this position
      const alreadyRegistered = await isUserRegistered(eventId, userId, position);
      if (alreadyRegistered) {
        return res.status(400).json({ 
          error: "You are already registered for this position" 
        });
      }

      const registration = await registerVolunteer({ eventId, position }, userId);
      res.status(201).json(registration);
    } catch (e) {
      next(e);
    }
  }
);

/** DELETE /volunteers/unregister → Unregister from a volunteer position */
router.delete(
  "/unregister",
  requireAuth,
  validateBody(VolunteerRegistrationSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { eventId, position } = req.body;
      const userId = req.user!.id;

      const success = await unregisterVolunteer(eventId, userId, position);
      if (!success) {
        return res.status(404).json({ 
          error: "Volunteer registration not found" 
        });
      }

      res.json({ message: "Successfully unregistered" });
    } catch (e) {
      next(e);
    }
  }
);

/** GET /volunteers/event/:eventId → Get all volunteers for an event */
router.get("/event/:eventId", async (req, res, next) => {
  try {
    const volunteers = await getVolunteersByEventId(req.params.eventId);
    res.json(volunteers);
  } catch (e) {
    next(e);
  }
});

/** GET /volunteers/my-events → Get volunteers for current user's events */
router.get("/my-events", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const eventVolunteers = await getVolunteersForUserEvents(req.user!.id);
    res.json(eventVolunteers);
  } catch (e) {
    next(e);
  }
});

export default router;
