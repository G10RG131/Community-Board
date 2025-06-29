// src/data/volunteerStore.ts
import { pool } from "../db";
import type {
  VolunteerRegistration,
  VolunteerRegistrationInput,
} from "../types/volunteer";

/**
 * Register a user as a volunteer for a specific position in an event
 */
export async function registerVolunteer(
  input: VolunteerRegistrationInput,
  userId: number
): Promise<VolunteerRegistration> {
  const { rows } = await pool.query<{
    id: number;
    event_id: string;
    user_id: number;
    position_name: string;
    registered_at: string;
  }>(
    `INSERT INTO volunteer_registrations (event_id, user_id, position_name)
     VALUES ($1, $2, $3)
     RETURNING id, event_id, user_id, position_name, registered_at`,
    [input.eventId, userId, input.position]
  );

  const r = rows[0];
  return {
    id: r.id,
    eventId: r.event_id,
    userId: r.user_id,
    position: r.position_name,
    registeredAt: r.registered_at,
  };
}

/**
 * Get all volunteer registrations for a specific event
 */
export async function getVolunteersByEventId(
  eventId: string
): Promise<VolunteerRegistration[]> {
  const { rows } = await pool.query<{
    id: number;
    event_id: string;
    user_id: number;
    position_name: string;
    registered_at: string;
    user_name: string;
    user_email: string;
  }>(
    `SELECT vr.id,
            vr.event_id,
            vr.user_id,
            vr.position_name,
            vr.registered_at,
            u.name   AS user_name,
            u.email  AS user_email
     FROM volunteer_registrations vr
     JOIN users u ON vr.user_id = u.id
     WHERE vr.event_id = $1
     ORDER BY vr.registered_at`,
    [eventId]
  );

  return rows.map((row) => ({
    id: row.id,
    eventId: row.event_id,
    userId: row.user_id,
    position: row.position_name,
    registeredAt: row.registered_at,
    userName: row.user_name,
    userEmail: row.user_email,
  }));
}

/**
 * Get all volunteer registrations for events created by a specific user
 * Grouped by event ID
 */
export async function getVolunteersForUserEvents(
  userId: number
): Promise<{ eventId: string; volunteers: VolunteerRegistration[] }[]> {
  const { rows } = await pool.query<{
    event_id: string;
    id: number;
    user_id: number;
    position_name: string;
    registered_at: string;
    user_name: string;
    user_email: string;
  }>(
    `SELECT vr.event_id,
            vr.id,
            vr.user_id,
            vr.position_name,
            vr.registered_at,
            u.name   AS user_name,
            u.email  AS user_email
     FROM volunteer_registrations vr
     JOIN users u ON vr.user_id = u.id
     JOIN events e ON vr.event_id = e.id
     WHERE e.user_id = $1
     ORDER BY e.date, vr.registered_at`,
    [userId]
  );

  const grouped: Record<string, VolunteerRegistration[]> = {};
  for (const row of rows) {
    const v: VolunteerRegistration = {
      id: row.id,
      eventId: row.event_id,
      userId: row.user_id,
      position: row.position_name,
      registeredAt: row.registered_at,
      userName: row.user_name,
      userEmail: row.user_email,
    };
    ;(grouped[row.event_id] ??= []).push(v);
  }

  return Object.entries(grouped).map(([eventId, volunteers]) => ({
    eventId,
    volunteers,
  }));
}

/**
 * Remove a volunteer registration
 */
export async function unregisterVolunteer(
  eventId: string,
  userId: number,
  position: string
): Promise<boolean> {
  const { rowCount } = await pool.query(
    `DELETE FROM volunteer_registrations
     WHERE event_id = $1
       AND user_id = $2
       AND position_name = $3`,
    [eventId, userId, position]
  );
  return (rowCount ?? 0) > 0;
}

/**
 * Check if a user is already registered for a specific position in an event
 */
export async function isUserRegistered(
  eventId: string,
  userId: number,
  position: string
): Promise<boolean> {
  const { rowCount } = await pool.query(
    `SELECT 1
     FROM volunteer_registrations
     WHERE event_id = $1
       AND user_id = $2
       AND position_name = $3
     LIMIT 1`,
    [eventId, userId, position]
  );
  return (rowCount ?? 0) > 0;
}

/**
 * Remove volunteer registrations for positions that no longer exist in an event
 */
export async function cleanupRemovedPositions(
  eventId: string,
  currentPositions: string[]
): Promise<void> {
  const all = await getVolunteersByEventId(eventId);
  const toRemove = all.filter((v) => !currentPositions.includes(v.position));
  for (const v of toRemove) {
    await pool.query(
      `DELETE FROM volunteer_registrations
       WHERE event_id = $1
         AND user_id = $2
         AND position_name = $3`,
      [eventId, v.userId, v.position]
    );
  }
}
