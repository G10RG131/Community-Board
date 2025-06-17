import { Router } from "express";
import { events } from "../data/eventsStore";

const router = Router();

/**
 * GET /events
 * Returns the full list of stored events.
 */
router.get("/", (_req, res) => {
  res.json(events);
});

export default router;
