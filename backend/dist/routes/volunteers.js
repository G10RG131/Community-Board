"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/volunteers.ts
const express_1 = require("express");
const zod_1 = require("zod");
const volunteerStore_1 = require("../data/volunteerStore");
const auth_1 = require("../middleware/auth");
const validateBody_1 = require("../middleware/validateBody");
const router = (0, express_1.Router)();
// Volunteer registration schema
const VolunteerRegistrationSchema = zod_1.z.object({
    eventId: zod_1.z.string().uuid("Invalid event ID"),
    position: zod_1.z.string().min(1, "Position is required")
});
/** POST /volunteers/register → Register as volunteer for a position */
router.post("/register", auth_1.requireAuth, (0, validateBody_1.validateBody)(VolunteerRegistrationSchema), async (req, res, next) => {
    try {
        const { eventId, position } = req.body;
        const userId = req.user.id;
        // Check if user is already registered for this position
        const alreadyRegistered = await (0, volunteerStore_1.isUserRegistered)(eventId, userId, position);
        if (alreadyRegistered) {
            return res.status(400).json({
                error: "You are already registered for this position"
            });
        }
        const registration = await (0, volunteerStore_1.registerVolunteer)({ eventId, position }, userId);
        res.status(201).json(registration);
    }
    catch (e) {
        next(e);
    }
});
/** DELETE /volunteers/unregister → Unregister from a volunteer position */
router.delete("/unregister", auth_1.requireAuth, (0, validateBody_1.validateBody)(VolunteerRegistrationSchema), async (req, res, next) => {
    try {
        const { eventId, position } = req.body;
        const userId = req.user.id;
        const success = await (0, volunteerStore_1.unregisterVolunteer)(eventId, userId, position);
        if (!success) {
            return res.status(404).json({
                error: "Volunteer registration not found"
            });
        }
        res.json({ message: "Successfully unregistered" });
    }
    catch (e) {
        next(e);
    }
});
/** GET /volunteers/event/:eventId → Get all volunteers for an event */
router.get("/event/:eventId", async (req, res, next) => {
    try {
        const volunteers = await (0, volunteerStore_1.getVolunteersByEventId)(req.params.eventId);
        res.json(volunteers);
    }
    catch (e) {
        next(e);
    }
});
/** GET /volunteers/my-events → Get volunteers for current user's events */
router.get("/my-events", auth_1.requireAuth, async (req, res, next) => {
    try {
        const eventVolunteers = await (0, volunteerStore_1.getVolunteersForUserEvents)(req.user.id);
        res.json(eventVolunteers);
    }
    catch (e) {
        next(e);
    }
});
exports.default = router;
