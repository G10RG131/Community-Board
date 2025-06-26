import { pool } from "../db";
import type { 
  VolunteerRegistration, 
  VolunteerRegistrationInput,
  VolunteerProfile,
  VolunteerProfileInput
} from "../types/volunteer";

// Event Volunteer Functions
export async function registerVolunteer(
  input: VolunteerRegistrationInput,
  userId: number
): Promise<VolunteerRegistration> {
  const { rows } = await pool.query(
    `INSERT INTO volunteer_registrations (event_id, user_id, position)
     VALUES ($1, $2, $3)
     RETURNING id, event_id as "eventId", user_id as "userId", position, registered_at as "registeredAt"`,
    [input.eventId, userId, input.position]
  );
  return rows[0];
}

export async function getVolunteersByEventId(eventId: string): Promise<VolunteerRegistration[]> {
  const { rows } = await pool.query(
    `SELECT 
      vr.id, 
      vr.event_id as "eventId", 
      vr.user_id as "userId", 
      vr.position, 
      vr.registered_at as "registeredAt",
      u.name as "userName", 
      u.email as "userEmail"
     FROM volunteer_registrations vr
     JOIN users u ON vr.user_id = u.id
     WHERE vr.event_id = $1
     ORDER BY vr.registered_at`,
    [eventId]
  );
  return rows;
}

export async function getVolunteersForUserEvents(userId: number): Promise<{ eventId: string; volunteers: VolunteerRegistration[] }[]> {
  const { rows } = await pool.query(
    `SELECT 
      vr.id, 
      vr.event_id as "eventId", 
      vr.user_id as "userId", 
      vr.position, 
      vr.registered_at as "registeredAt",
      u.name as "userName", 
      u.email as "userEmail",
      e.title as "eventTitle"
     FROM volunteer_registrations vr
     JOIN users u ON vr.user_id = u.id
     JOIN events e ON vr.event_id = e.id
     WHERE e.user_id = $1
     ORDER BY e.date, vr.registered_at`,
    [userId]
  );

  const eventVolunteers: Record<string, VolunteerRegistration[]> = {};
  rows.forEach(row => {
    if (!eventVolunteers[row.eventId]) {
      eventVolunteers[row.eventId] = [];
    }
    eventVolunteers[row.eventId].push(row);
  });

  return Object.entries(eventVolunteers).map(([eventId, volunteers]) => ({
    eventId,
    volunteers
  }));
}

export async function unregisterVolunteer(
  eventId: string,
  userId: number,
  position: string
): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM volunteer_registrations
     WHERE event_id = $1 AND user_id = $2 AND position = $3`,
    [eventId, userId, position]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function isUserRegistered(
  eventId: string,
  userId: number,
  position: string
): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT 1 FROM volunteer_registrations
     WHERE event_id = $1 AND user_id = $2 AND position = $3`,
    [eventId, userId, position]
  );
  return rows.length > 0;
}

// Volunteer Profile Functions
export async function createVolunteerProfile(
  input: VolunteerProfileInput,
  userId: number
): Promise<VolunteerProfile> {
  const { rows } = await pool.query(
    `INSERT INTO volunteer_profiles 
     (user_id, skills, age, gender, contact_email, is_public)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING 
       id, 
       user_id as "userId", 
       skills, 
       age, 
       gender, 
       contact_email as "contactEmail",
       created_at as "createdAt"`,
    [userId, input.skills, input.age, input.gender, input.contactEmail, true]
  );
  return rows[0];
}

export async function getVolunteerProfile(
  userId: number
): Promise<VolunteerProfile | null> {
  const { rows } = await pool.query(
    `SELECT 
       id, 
       user_id as "userId", 
       skills, 
       age, 
       gender, 
       contact_email as "contactEmail",
       created_at as "createdAt"
     FROM volunteer_profiles 
     WHERE user_id = $1`,
    [userId]
  );
  return rows[0] || null;
}

export async function getPublicVolunteers(): Promise<VolunteerProfile[]> {
  const { rows } = await pool.query(
    `SELECT 
       id, 
       skills, 
       age, 
       gender
     FROM volunteer_profiles
     WHERE is_public = true`
  );
  return rows;
}

export async function cleanupRemovedPositions(
  eventId: string,
  currentPositions: string[]
): Promise<void> {
  const currentVolunteers = await getVolunteersByEventId(eventId);
  const volunteersToRemove = currentVolunteers.filter(
    volunteer => !currentPositions.includes(volunteer.position)
  );
  
  for (const volunteer of volunteersToRemove) {
    await pool.query(
      `DELETE FROM volunteer_registrations
       WHERE event_id = $1 AND user_id = $2 AND position = $3`,
      [eventId, volunteer.userId, volunteer.position]
    );
  }
}