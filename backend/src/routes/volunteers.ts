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
import { ApiError } from "../utils/ApiError";

const router = Router();
router.use(requireAuth);

const VolunteerRegistrationSchema = z.object({
  eventId: z.string().uuid(),
  position: z.string().min(1),
});

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

router.get(
  "/:eventId",
  asyncHandler(async (req, res) => {
    const list = await getVolunteersByEventId(req.params.eventId);
    res.json(list);
  })
);

router.get(
  "/my-events",
  asyncHandler(async (req, res) => {
    const lists = await getVolunteersForUserEvents(
      (req as AuthenticatedRequest).user.id
    );
    res.json(lists);
  })
);

export default router;
