// src/data/eventsStore.ts
import { randomUUID } from "crypto";
import { pool } from "../db";
import type { Event } from "../types/event";

export async function createEvent(
  input: Omit<Event, "id">
): Promise<Event> {
  const newId = randomUUID();          
  const { rows } = await pool.query(
    `INSERT INTO events (id, title, date, location, description, image, volunteer_positions)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, title, date, location, description, image, volunteer_positions`,
    [newId, input.title, input.date, input.location, input.description, input.image, JSON.stringify(input.volunteerPositions || [])]
  );
  
  // Transform database result to Event interface
  const dbEvent = rows[0];
  let volunteerPositions = [];
  try {
    if (dbEvent.volunteer_positions) {
      if (typeof dbEvent.volunteer_positions === 'string') {
        volunteerPositions = JSON.parse(dbEvent.volunteer_positions);
      } else if (Array.isArray(dbEvent.volunteer_positions)) {
        volunteerPositions = dbEvent.volunteer_positions;
      }
    }
  } catch (error) {
    console.warn('Failed to parse volunteer_positions in createEvent:', error);
    volunteerPositions = [];
  }

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    date: dbEvent.date,
    location: dbEvent.location,
    description: dbEvent.description,
    image: dbEvent.image,
    volunteerPositions
  };
}

export async function getEvents(): Promise<Event[]> {
  const { rows } = await pool.query(
    `SELECT id, title, date, location, description, image, volunteer_positions
     FROM events
     ORDER BY date`
  );
  
  // Transform database results to Event interface
  return rows.map(dbEvent => {
    let volunteerPositions = [];
    try {
      if (dbEvent.volunteer_positions) {
        // Handle both string and already parsed array
        if (typeof dbEvent.volunteer_positions === 'string') {
          volunteerPositions = JSON.parse(dbEvent.volunteer_positions);
        } else if (Array.isArray(dbEvent.volunteer_positions)) {
          volunteerPositions = dbEvent.volunteer_positions;
        }
      }
    } catch (error) {
      console.warn('Failed to parse volunteer_positions for event', dbEvent.id, ':', error);
      volunteerPositions = [];
    }

    return {
      id: dbEvent.id,
      title: dbEvent.title,
      date: dbEvent.date,
      location: dbEvent.location,
      description: dbEvent.description,
      image: dbEvent.image,
      volunteerPositions
    };
  });
}

/**
 * Delete the event with the given ID.
 * @param id Event UUID
 * @returns The deleted event, or null if none existed.
 */
export async function deleteEventById(id: string): Promise<Event | null> {
    const { rows } = await pool.query(
      `DELETE FROM events
       WHERE id = $1
       RETURNING id, title, date, location, description, image, volunteer_positions`,
      [id]
    );
    
    if (rows.length === 0) return null;
    
    const dbEvent = rows[0];
    let volunteerPositions = [];
    try {
      if (dbEvent.volunteer_positions) {
        if (typeof dbEvent.volunteer_positions === 'string') {
          volunteerPositions = JSON.parse(dbEvent.volunteer_positions);
        } else if (Array.isArray(dbEvent.volunteer_positions)) {
          volunteerPositions = dbEvent.volunteer_positions;
        }
      }
    } catch (error) {
      console.warn('Failed to parse volunteer_positions in deleteEventById:', error);
      volunteerPositions = [];
    }

    return {
      id: dbEvent.id,
      title: dbEvent.title,
      date: dbEvent.date,
      location: dbEvent.location,
      description: dbEvent.description,
      image: dbEvent.image,
      volunteerPositions
    };
}

/**
 * Fetch a single event by its ID.
 * @param id Event UUID
 * @returns The event, or null if none found.
 */
export async function getEventById(id: string): Promise<Event | null> {
    const { rows } = await pool.query(
      `SELECT id, title, date, location, description, image, volunteer_positions
       FROM events
       WHERE id = $1`,
      [id]
    );
    
    if (rows.length === 0) return null;
    
    const dbEvent = rows[0];
    let volunteerPositions = [];
    try {
      if (dbEvent.volunteer_positions) {
        if (typeof dbEvent.volunteer_positions === 'string') {
          volunteerPositions = JSON.parse(dbEvent.volunteer_positions);
        } else if (Array.isArray(dbEvent.volunteer_positions)) {
          volunteerPositions = dbEvent.volunteer_positions;
        }
      }
    } catch (error) {
      console.warn('Failed to parse volunteer_positions in getEventById:', error);
      volunteerPositions = [];
    }

    return {
      id: dbEvent.id,
      title: dbEvent.title,
      date: dbEvent.date,
      location: dbEvent.location,
      description: dbEvent.description,
      image: dbEvent.image,
      volunteerPositions
    };
}
  
 /**
 * Update any subset of {title, date, location, description} on an event.
 * Returns the updated row, or null if the ID wasn’t found.
 */
export async function updateEventById(
    id: string,
    updates: Partial<Omit<Event, "id">>
  ): Promise<Event | null> {
    const { rows } = await pool.query(
      `UPDATE events
         SET
           title              = COALESCE($2, title),
           date               = COALESCE($3, date),
           location           = COALESCE($4, location),
           description        = COALESCE($5, description),
           image              = COALESCE($6, image),
           volunteer_positions = COALESCE($7, volunteer_positions)
       WHERE id = $1
       RETURNING id, title, date, location, description, image, volunteer_positions`,
      [
        id,
        updates.title,
        updates.date,
        updates.location,
        updates.description,
        updates.image,
        updates.volunteerPositions ? JSON.stringify(updates.volunteerPositions) : null
      ]
    );
    
    if (rows.length === 0) return null;
    
    const dbEvent = rows[0];
    let volunteerPositions = [];
    try {
      if (dbEvent.volunteer_positions) {
        if (typeof dbEvent.volunteer_positions === 'string') {
          volunteerPositions = JSON.parse(dbEvent.volunteer_positions);
        } else if (Array.isArray(dbEvent.volunteer_positions)) {
          volunteerPositions = dbEvent.volunteer_positions;
        }
      }
    } catch (error) {
      console.warn('Failed to parse volunteer_positions in updateEventById:', error);
      volunteerPositions = [];
    }

    return {
      id: dbEvent.id,
      title: dbEvent.title,
      date: dbEvent.date,
      location: dbEvent.location,
      description: dbEvent.description,
      image: dbEvent.image,
      volunteerPositions
    };
}
   
