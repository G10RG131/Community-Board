import { Router } from "express";
import { z } from "zod";
import {
  createVolunteerProfile,
  getPublicVolunteers,
  getVolunteerProfile,
  registerVolunteer,
  getVolunteersByEventId,
  getVolunteersForUserEvents,
  unregisterVolunteer,
  isUserRegistered
} from "../data/volunteerStore";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { validateBody } from "../middleware/validateBody";

const router = Router();

// Schema Definitions
const VolunteerRegistrationSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
  position: z.string().min(1, "Position is required")
});

const VolunteerProfileSchema = z.object({
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  age: z.number().min(16, "Must be at least 16 years old"),
  gender: z.string().min(1, "Gender is required"),
  contactEmail: z.string().email("Invalid email address")
});

// Public Routes
router.get("/public", async (req, res, next) => {
  try {
    const volunteers = await getPublicVolunteers();
    res.json(volunteers);
  } catch (e) {
    next(e);
  }
});

router.get("/event/:eventId", async (req, res, next) => {
  try {
    const volunteers = await getVolunteersByEventId(req.params.eventId);
    res.json(volunteers);
  } catch (e) {
    next(e);
  }
});

// Authenticated Routes
router.post("/register",
  requireAuth,
  validateBody(VolunteerRegistrationSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { eventId, position } = req.body;
      const userId = req.user!.id;

      if (await isUserRegistered(eventId, userId, position)) {
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

router.delete("/unregister",
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

router.get("/my-events", 
  requireAuth,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const eventVolunteers = await getVolunteersForUserEvents(req.user!.id);
      res.json(eventVolunteers);
    } catch (e) {
      next(e);
    }
  }
);

// Volunteer Profile Routes
router.post("/profile",
  requireAuth,
  validateBody(VolunteerProfileSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const profile = await createVolunteerProfile(req.body, req.user!.id);
      res.status(201).json(profile);
    } catch (e) {
      next(e);
    }
  }
);

router.get("/profile", 
  requireAuth,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const profile = await getVolunteerProfile(req.user!.id);
      res.json(profile || null);
    } catch (e) {
      next(e);
    }
  }
);

export default router;