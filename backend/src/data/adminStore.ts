// src/data/adminStore.ts
import { pool } from "../db";
import type { Event } from "../types/event";

interface RawEventRow {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string | null;
  image: string | null;
  volunteer_positions: any;
  user_id: number | null;
  status: string;
  submitted_at: string;
  approved_by: number | null;
}

const parsePositions = (r: RawEventRow): string[] => {
  if (!r.volunteer_positions) return [];
  try {
    return Array.isArray(r.volunteer_positions)
      ? r.volunteer_positions
      : JSON.parse(r.volunteer_positions);
  } catch {
    return [];
  }
};

const trimQuotes = (s: string): string => s.replace(/^'+|'+$/g, "");

const mapRow = (r: RawEventRow): Event => ({
  id: r.id,
  title: r.title,
  date: r.date,
  location: r.location,
  description: r.description || undefined,
  image: r.image || undefined,
  volunteerPositions: parsePositions(r),
  userId: r.user_id || undefined,
  status: trimQuotes(r.status) as "pending" | "approved" | "rejected",
  submittedAt: r.submitted_at,
  approvedBy: r.approved_by,
});

/** Audit‐log an approval or rejection */
async function logApproval(
  eventId: string,
  adminId: number,
  action: "approved" | "rejected",
  reason?: string
) {
  await pool.query(
    `INSERT INTO event_approvals (event_id, admin_id, action, reason)
     VALUES ($1, $2, $3, $4)`,
    [eventId, adminId, action, reason ?? null]
  );
}

export async function getPendingEvents(): Promise<Event[]> {
  const { rows } = await pool.query<RawEventRow>(
    `SELECT id, title, date, location,
            description, image,
            volunteer_positions, user_id,
            status, submitted_at, approved_by
     FROM events
     ORDER BY submitted_at`
  );
  return rows.map(mapRow).filter((e) => e.status === "pending");
}

export async function approveEventById(
  id: string,
  adminId: number,
  reason?: string
): Promise<Event | null> {
  const { rows } = await pool.query<RawEventRow>(
    `UPDATE events
     SET status = 'approved',
         approved_by = $1
     WHERE id = $2
     RETURNING id, title, date, location,
               description, image,
               volunteer_positions, user_id,
               status, submitted_at, approved_by`,
    [adminId, id]
  );
  if (!rows[0]) return null;
  await logApproval(id, adminId, "approved", reason);
  return mapRow(rows[0]);
}

export async function rejectEventById(
  id: string,
  adminId: number,
  reason?: string
): Promise<Event | null> {
  const { rows } = await pool.query<RawEventRow>(
    `UPDATE events
     SET status = 'rejected',
         approved_by = $1
     WHERE id = $2
     RETURNING id, title, date, location,
               description, image,
               volunteer_positions, user_id,
               status, submitted_at, approved_by`,
    [adminId, id]
  );
  if (!rows[0]) return null;
  await logApproval(id, adminId, "rejected", reason);
  return mapRow(rows[0]);
}

/** Fetch the audit trail for a specific event */
export async function getAuditLogs(
  eventId: string
): Promise<{ adminId: number; action: "approved" | "rejected"; timestamp: string; reason?: string }[]> {
  const { rows } = await pool.query<{
    admin_id: number;
    action: string;
    created_at: string;
    reason: string | null;
  }>(
    `SELECT admin_id, action, created_at, reason
     FROM event_approvals
     WHERE event_id = $1
     ORDER BY created_at`,
    [eventId]
  );
  return rows.map((r) => ({
    adminId: r.admin_id,
    action: r.action as "approved" | "rejected",
    timestamp: r.created_at,
    reason: r.reason ?? undefined,
  }));
}
