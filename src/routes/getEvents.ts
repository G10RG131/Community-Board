import { Router } from "express";
import { Event } from "../types/event";

// In-memory store (will swap to file later)
const events: Event[] = [];

const router = Router();

/**
 * GET /events
 * Returns the full list of stored events.
 */
router.get("/", (_req, res) => {
  res.json(events);
});

export default router;
