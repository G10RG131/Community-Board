import { Router } from "express";
import { getEvents } from "../data/eventsStore";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (err) {
    next(err);
  }
});

export default router;
