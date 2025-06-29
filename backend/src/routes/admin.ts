// src/routes/admin.ts
import { Router, Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../middleware/auth";
import { requireAuth, requireAdmin } from "../middleware/auth";
import {
  getPendingEvents,
  approveEventById,
  rejectEventById,
} from "../data/adminStore";
import type { Event } from "../types/event";

const router = Router();

// require auth+admin for all admin routes
router.use(requireAuth, requireAdmin);

// GET /admin/events/pending
router.get("/events/pending", async (_req, res, next) => {
  try {
    const pending: Event[] = await getPendingEvents();
    res.json(pending);
  } catch (err) {
    next(err);
  }
});

// POST /admin/events/:id/approve
router.post("/events/:id/approve", async (req, res, next) => {
  try {
    const evt = await approveEventById(
      req.params.id,
      (req as AuthenticatedRequest).user.id
    );
    if (!evt) return res.status(404).json({ error: "Event not found" });
    res.json(evt);
  } catch (err) {
    next(err);
  }
});

// POST /admin/events/:id/reject
router.post("/events/:id/reject", async (req, res, next) => {
  try {
    const evt = await rejectEventById(
      req.params.id,
      (req as AuthenticatedRequest).user.id
    );
    if (!evt) return res.status(404).json({ error: "Event not found" });
    res.json(evt);
  } catch (err) {
    next(err);
  }
});

export default router;
