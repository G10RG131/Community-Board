import { Router } from "express";
import { getEvents, getEventById, deleteEventById } from "../data/eventsStore";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /events/:id – Remove an event by ID.
 * Responds 404 if not found, or 200 with the deleted row.
 */
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

export default router;
