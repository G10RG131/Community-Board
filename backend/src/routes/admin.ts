// src/routes/admin.ts
import { Router } from "express";
import type { AuthenticatedRequest } from "../middleware/auth";
import { requireAuth, requireAdmin } from "../middleware/auth";
import {
  listPendingEvents,
  approveEvent,
  rejectEvent,
} from "../services/adminService";
import { getAuditLogs } from "../data/adminStore";
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
    const pending: Event[] = await listPendingEvents();
    res.json(pending);
  })
);

// POST /admin/events/:id/approve
router.post(
  "/events/:id/approve",
  asyncHandler(async (req, res) => {
    const evt = await approveEvent(
      req.params.id,
      (req as AuthenticatedRequest).user.id
    );
    res.json(evt);
  })
);

// POST /admin/events/:id/reject
router.post(
  "/events/:id/reject",
  asyncHandler(async (req, res) => {
    const evt = await rejectEvent(
      req.params.id,
      (req as AuthenticatedRequest).user.id
    );
    res.json(evt);
  })
);

// GET /admin/audit/:eventId
router.get(
  "/audit/:eventId",
  asyncHandler(async (req, res) => {
    const audit = await getAuditLogs(req.params.eventId);
    res.json(audit);
  })
);

export default router;
