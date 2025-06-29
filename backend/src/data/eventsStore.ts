// src/data/eventsStore.ts

import { randomUUID } from "crypto";
import { pool } from "../db";
import type { Event } from "../types/event";

function parsePositions(raw: any): string[] {
  if (!raw.volunteer_positions) return [];
  try {
    return Array.isArray(raw.volunteer_positions)
      ? raw.volunteer_positions
      : JSON.parse(raw.volunteer_positions);
  } catch {
    return [];
  }
}

// ─── CREATE ─────────────────────────────────────────────────────────────────────

export async function createEvent(
  input: Omit<Event, "id" | "status" | "submittedAt" | "approvedBy">,
  userId?: number
): Promise<Event> {
  const id = randomUUID();
  const { rows } = await pool.query(
    `INSERT INTO events (
       id, title, date, location, description, image, volunteer_positions, user_id
     ) VALUES (
       $1,$2,$3,$4,$5,$6,$7,$8
     ) RETURNING
       id, title, date, location, description, image,
       volunteer_positions, user_id,
       status, submitted_at AS "submittedAt", approved_by AS "approvedBy"`,
    [
      id,
      input.title,
      input.date,
      input.location,
      input.description || null,
      input.image || null,
      JSON.stringify(input.volunteerPositions || []),
      userId || null,
    ]
  );
  const r = rows[0];
  return {
    id: r.id,
    title: r.title,
    date: r.date,
    location: r.location,
    description: r.description,
    image: r.image,
    volunteerPositions: parsePositions(r),
    userId: r.user_id,
    status: r.status,
    submittedAt: r.submittedAt,
    approvedBy: r.approvedBy,
  };
}

// ─── READ ALL ───────────────────────────────────────────────────────────────────

export async function getEvents(): Promise<Event[]> {
  const { rows } = await pool.query(
    `SELECT
       id, title, date, location, description, image,
       volunteer_positions, user_id,
       status, submitted_at AS "submittedAt", approved_by AS "approvedBy"
     FROM events
     ORDER BY date`
  );
  return rows.map(r => ({
    id: r.id,
    title: r.title,
    date: r.date,
    location: r.location,
    description: r.description,
    image: r.image,
    volunteerPositions: parsePositions(r),
    userId: r.user_id,
    status: r.status,
    submittedAt: r.submittedAt,
    approvedBy: r.approvedBy,
  }));
}

// ─── READ ONE ───────────────────────────────────────────────────────────────────

export async function getEventById(id: string): Promise<Event | null> {
  const { rows } = await pool.query(
    `SELECT
       id, title, date, location, description, image,
       volunteer_positions, user_id,
       status, submitted_at AS "submittedAt", approved_by AS "approvedBy"
     FROM events
     WHERE id = $1`,
    [id]
  );
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: r.id,
    title: r.title,
    date: r.date,
    location: r.location,
    description: r.description,
    image: r.image,
    volunteerPositions: parsePositions(r),
    userId: r.user_id,
    status: r.status,
    submittedAt: r.submittedAt,
    approvedBy: r.approvedBy,
  };
}

// ─── UPDATE ─────────────────────────────────────────────────────────────────────

export async function updateEventById(
  id: string,
  updates: Partial<Omit<Event, "id" | "status" | "submittedAt" | "approvedBy">>
): Promise<Event | null> {
  const { rows } = await pool.query(
    `UPDATE events SET
       title              = COALESCE($2, title),
       date               = COALESCE($3, date),
       location           = COALESCE($4, location),
       description        = COALESCE($5, description),
       image              = COALESCE($6, image),
       volunteer_positions = COALESCE($7, volunteer_positions)
     WHERE id = $1
     RETURNING
       id, title, date, location, description, image,
       volunteer_positions, user_id,
       status, submitted_at AS "submittedAt", approved_by AS "approvedBy"`,
    [
      id,
      updates.title ?? null,
      updates.date ?? null,
      updates.location ?? null,
      updates.description ?? null,
      updates.image ?? null,
      updates.volunteerPositions
        ? JSON.stringify(updates.volunteerPositions)
        : null,
    ]
  );
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: r.id,
    title: r.title,
    date: r.date,
    location: r.location,
    description: r.description,
    image: r.image,
    volunteerPositions: parsePositions(r),
    userId: r.user_id,
    status: r.status,
    submittedAt: r.submittedAt,
    approvedBy: r.approvedBy,
  };
}

// ─── DELETE ─────────────────────────────────────────────────────────────────────

export async function deleteEventById(id: string): Promise<Event | null> {
  const { rows } = await pool.query(
    `DELETE FROM events
     WHERE id = $1
     RETURNING
       id, title, date, location, description, image,
       volunteer_positions, user_id,
       status, submitted_at AS "submittedAt", approved_by AS "approvedBy"`,
    [id]
  );
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: r.id,
    title: r.title,
    date: r.date,
    location: r.location,
    description: r.description,
    image: r.image,
    volunteerPositions: parsePositions(r),
    userId: r.user_id,
    status: r.status,
    submittedAt: r.submittedAt,
    approvedBy: r.approvedBy,
  };
}

// ─── ADMIN WORKFLOW ─────────────────────────────────────────────────────────────

/** List all pending */
export async function getPendingEvents(): Promise<Event[]> {
  const { rows } = await pool.query(
    `SELECT
       id, title, date, location, description, image,
       volunteer_positions, user_id,
       status, submitted_at AS "submittedAt", approved_by AS "approvedBy"
     FROM events
     WHERE status = 'pending'
     ORDER BY submitted_at`
  );
  return rows.map(r => ({
    id: r.id,
    title: r.title,
    date: r.date,
    location: r.location,
    description: r.description,
    image: r.image,
    volunteerPositions: parsePositions(r),
    userId: r.user_id,
    status: r.status,
    submittedAt: r.submittedAt,
    approvedBy: r.approvedBy,
  }));
}

/** Approve */
export async function approveEventById(
  id: string,
  adminId: number
): Promise<Event | null> {
  const { rows } = await pool.query(
    `UPDATE events
     SET status = 'approved', approved_by = $2
     WHERE id = $1
     RETURNING
       id, title, date, location, description, image,
       volunteer_positions, user_id,
       status, submitted_at AS "submittedAt", approved_by AS "approvedBy"`,
    [id, adminId]
  );
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: r.id,
    title: r.title,
    date: r.date,
    location: r.location,
    description: r.description,
    image: r.image,
    volunteerPositions: parsePositions(r),
    userId: r.user_id,
    status: r.status,
    submittedAt: r.submittedAt,
    approvedBy: r.approvedBy,
  };
}

/** Reject */
export async function rejectEventById(
  id: string,
  adminId: number
): Promise<Event | null> {
  const { rows } = await pool.query(
    `UPDATE events
     SET status = 'rejected', approved_by = $2
     WHERE id = $1
     RETURNING
       id, title, date, location, description, image,
       volunteer_positions, user_id,
       status, submitted_at AS "submittedAt", approved_by AS "approvedBy"`,
    [id, adminId]
  );
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: r.id,
    title: r.title,
    date: r.date,
    location: r.location,
    description: r.description,
    image: r.image,
    volunteerPositions: parsePositions(r),
    userId: r.user_id,
    status: r.status,
    submittedAt: r.submittedAt,
    approvedBy: r.approvedBy,
  };
}
