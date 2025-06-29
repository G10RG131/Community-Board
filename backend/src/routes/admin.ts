// src/routes/admin.ts
import { Router } from "express";
import type { AuthenticatedRequest } from "../middleware/auth";
import { requireAuth, requireAdmin } from "../middleware/auth";
import {
  getPendingEvents,
  approveEventById,
  rejectEventById,
} from "../data/adminStore";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import type { Event } from "../types/event";

const router = Router();

// require auth+admin for all admin routes
router.use(requireAuth, requireAdmin);

// GET /admin/events/pending
router.get(
  "/events/pending",
  asyncHandler(async (_req, res) => {
    const pending: Event[] = await getPendingEvents();
    res.json(pending);
  })
);

// POST /admin/events/:id/approve
router.post(
  "/events/:id/approve",
  asyncHandler(async (req, res) => {
    const evt = await approveEventById(
      req.params.id,
      (req as AuthenticatedRequest).user.id
    );
    if (!evt) throw new ApiError(404, "Event not found");
    res.json(evt);
  })
);

// POST /admin/events/:id/reject
router.post(
  "/events/:id/reject",
  asyncHandler(async (req, res) => {
    const evt = await rejectEventById(
      req.params.id,
      (req as AuthenticatedRequest).user.id
    );
    if (!evt) throw new ApiError(404, "Event not found");
    res.json(evt);
  })
);

export default router;
