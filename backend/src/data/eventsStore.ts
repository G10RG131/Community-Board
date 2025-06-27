// src/data/eventsStore.ts
import { randomUUID } from 'crypto';
import { pool } from '../db';
import type { Event } from '../types/event';
import { cleanupRemovedPositions } from './volunteerStore';

/**
 * Normalize a raw DB row into our Event interface.
 */
function parseDbEvent(db: any): Event {
  let volunteerPositions: string[] = [];
  try {
    if (db.volunteer_positions) {
      if (typeof db.volunteer_positions === 'string') {
        volunteerPositions = JSON.parse(db.volunteer_positions);
      } else if (Array.isArray(db.volunteer_positions)) {
        volunteerPositions = db.volunteer_positions;
      }
    }
  } catch (error) {
    console.warn('Failed to parse volunteer_positions:', error);
  }

  return {
    id: db.id,
    title: db.title,
    date: db.date.toISOString(),
    location: db.location,
    description: db.description,
    image: db.image,
    volunteerPositions,
    userId: db.user_id,
    status: db.status,
    submittedAt: db.submitted_at.toISOString(),
    approvedBy: db.approved_by ?? undefined,
    createdAt: db.created_at.toISOString(),
    updatedAt: db.updated_at.toISOString(),
  };
}

/**
 * List pending events for admin review.
 */
export async function getPendingEvents(): Promise<Event[]> {
  const { rows } = await pool.query(
    `SELECT * FROM events WHERE status = 'pending' ORDER BY submitted_at DESC`
  );
  return rows.map(parseDbEvent);
}

/**
 * Approve a pending event.
 */
export async function approveEventById(
  id: string,
  adminUserId: number
): Promise<Event | null> {
  const { rows } = await pool.query(
    `UPDATE events
     SET status = 'approved', approved_by = $2, updated_at = NOW()
     WHERE id = $1 AND status = 'pending'
     RETURNING *`,
    [id, adminUserId]
  );
  return rows[0] ? parseDbEvent(rows[0]) : null;
}

/**
 * Decline a pending event.
 */
export async function declineEventById(id: string): Promise<Event | null> {
  const { rows } = await pool.query(
    `UPDATE events
     SET status = 'declined', updated_at = NOW()
     WHERE id = $1 AND status = 'pending'
     RETURNING *`,
    [id]
  );
  return rows[0] ? parseDbEvent(rows[0]) : null;
}

// ---------------- Existing CRUD below ----------------

export async function createEvent(
  input: Omit<Event, 'id'>,
  userId?: number
): Promise<Event> {
  const newId = randomUUID();
  const { rows } = await pool.query<any>(
    `INSERT INTO events
       (id, title, date, location, description, image, volunteer_positions, user_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [
      newId,
      input.title,
      input.date,
      input.location,
      input.description,
      input.image,
      JSON.stringify(input.volunteerPositions || []),
      userId
    ]
  );
  return parseDbEvent(rows[0]);
}

export async function getEvents(): Promise<Event[]> {
  const { rows } = await pool.query<any>(
    `SELECT * FROM events ORDER BY date`
  );
  return rows.map(parseDbEvent);
}

export async function getEventById(id: string): Promise<Event | null> {
  const { rows } = await pool.query<any>(
    `SELECT * FROM events WHERE id = $1`,
    [id]
  );
  return rows[0] ? parseDbEvent(rows[0]) : null;
}

export async function updateEventById(
  id: string,
  updates: Partial<Omit<Event, 'id'>>
): Promise<Event | null> {
  if (updates.volunteerPositions) {
    await cleanupRemovedPositions(id, updates.volunteerPositions);
  }
  const { rows } = await pool.query<any>(
    `UPDATE events
       SET
         title               = COALESCE($2, title),
         date                = COALESCE($3, date),
         location            = COALESCE($4, location),
         description         = COALESCE($5, description),
         image               = COALESCE($6, image),
         volunteer_positions = COALESCE($7, volunteer_positions),
         updated_at          = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      updates.title,
      updates.date,
      updates.location,
      updates.description,
      updates.image,
      updates.volunteerPositions
        ? JSON.stringify(updates.volunteerPositions)
        : null,
    ]
  );
  return rows[0] ? parseDbEvent(rows[0]) : null;
}

export async function deleteEventById(id: string): Promise<Event | null> {
  const { rows } = await pool.query<any>(
    `DELETE FROM events WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows[0] ? parseDbEvent(rows[0]) : null;
}

export async function getEventsByUserId(userId: number): Promise<Event[]> {
  const { rows } = await pool.query<any>(
    `SELECT * FROM events WHERE user_id = $1 ORDER BY date`,
    [userId]
  );
  return rows.map(parseDbEvent);
}

export async function checkEventOwnership(
  eventId: string,
  userId: number
): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT 1 FROM events WHERE id = $1 AND user_id = $2`,
    [eventId, userId]
  );
  return rows.length > 0;
}
