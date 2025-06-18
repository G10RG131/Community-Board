"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventsStore_1 = require("../data/eventsStore");
const router = (0, express_1.Router)();
router.get("/", async (_req, res, next) => {
    try {
        const events = await (0, eventsStore_1.getEvents)();
        res.json(events);
    }
    catch (err) {
        next(err);
    }
});
/**
 * DELETE /events/:id – Remove an event by ID.
 * Responds 404 if not found, or 200 with the deleted row.
 */
router.delete("/:id", async (req, res, next) => {
    try {
        const deleted = await (0, eventsStore_1.deleteEventById)(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.json(deleted);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
