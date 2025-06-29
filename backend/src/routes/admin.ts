// src/routes/admin.ts
import { Router } from "express";
import { z } from "zod";
import type { AuthenticatedRequest } from "../middleware/auth";
import { requireAuth, requireAdmin } from "../middleware/auth";
import {
  listPendingEvents,
  approveEvent,
  rejectEvent,
} from "../services/adminService";
import { getAuditLogs } from "../data/adminStore";
import { asyncHandler } from "../utils/asyncHandler";
import { validateBody } from "../middleware/validateBody";
import { pool } from "../db";
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

const ReasonSchema = z.object({
  reason: z.string().min(1).optional(),
});

// POST /admin/events/:id/approve
router.post(
  "/events/:id/approve",
  validateBody(ReasonSchema),
  asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const evt = await approveEvent(
      req.params.id,
      (req as AuthenticatedRequest).user.id,
      reason
    );
    res.json(evt);
  })
);

// POST /admin/events/:id/reject
router.post(
  "/events/:id/reject",
  validateBody(ReasonSchema),
  asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const evt = await rejectEvent(
      req.params.id,
      (req as AuthenticatedRequest).user.id,
      reason
    );
    res.json(evt);
  })
);

// POST /admin/events/bulk-approve
router.post(
  "/events/bulk-approve",
  validateBody(
    z.object({
      ids: z.array(z.string().uuid()).min(1),
      reason: z.string().optional(),
    })
  ),
  asyncHandler(async (req, res) => {
    const { ids, reason } = req.body as { ids: string[]; reason?: string };
    const results: Event[] = [];
    for (const id of ids) {
      const evt = await approveEvent(
        id,
        (req as AuthenticatedRequest).user.id,
        reason
      );
      results.push(evt);
    }
    res.json(results);
  })
);

// POST /admin/events/bulk-reject
router.post(
  "/events/bulk-reject",
  validateBody(
    z.object({
      ids: z.array(z.string().uuid()).min(1),
      reason: z.string().optional(),
    })
  ),
  asyncHandler(async (req, res) => {
    const { ids, reason } = req.body as { ids: string[]; reason?: string };
    const results: Event[] = [];
    for (const id of ids) {
      const evt = await rejectEvent(
        id,
        (req as AuthenticatedRequest).user.id,
        reason
      );
      results.push(evt);
    }
    res.json(results);
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

// GET /admin/stats
router.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const { rows: daily } = await pool.query<{
      date: string;
      approved: number;
      rejected: number;
    }>(
      `SELECT
         to_char(created_at, 'YYYY-MM-DD') AS date,
         COUNT(*) FILTER (WHERE action='approved')  AS approved,
         COUNT(*) FILTER (WHERE action='rejected')  AS rejected
       FROM event_approvals
       GROUP BY date
       ORDER BY date DESC`
    );

    const { rows: byAdmin } = await pool.query<{
      admin_id: number;
      approved: number;
      rejected: number;
    }>(
      `SELECT
         admin_id,
         COUNT(*) FILTER (WHERE action='approved') AS approved,
         COUNT(*) FILTER (WHERE action='rejected') AS rejected
       FROM event_approvals
       GROUP BY admin_id`
    );

    res.json({ daily, byAdmin });
  })
);

export default router;
