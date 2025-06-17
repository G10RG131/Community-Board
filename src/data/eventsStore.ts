// src/data/eventsStore.ts
import { randomUUID } from "crypto";
import { pool } from "../db";
import type { Event } from "../types/event";

export async function createEvent(
  input: Omit<Event, "id">
): Promise<Event> {
  const newId = randomUUID();          
  const { rows } = await pool.query<Event>(
    `INSERT INTO events (id, title, date, location, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [newId, input.title, input.date, input.location, input.description]
  );
  return rows[0];
}

export async function getEvents(): Promise<Event[]> {
  const { rows } = await pool.query<Event>(
    `SELECT id, title, date, location, description
     FROM events
     ORDER BY date`
  );
  return rows;
}

/**
 * Delete the event with the given ID.
 * @param id Event UUID
 * @returns The deleted event, or null if none existed.
 */
export async function deleteEventById(id: string): Promise<Event | null> {
    const { rows } = await pool.query<Event>(
      `DELETE FROM events
       WHERE id = $1
       RETURNING id, title, date, location, description`,
      [id]
    );
    return rows[0] ?? null;
  }
  

/**
 * Fetch a single event by its ID.
 * @param id Event UUID
 * @returns The event, or null if none found.
 */
export async function getEventById(id: string): Promise<Event | null> {
    const { rows } = await pool.query<Event>(
      `SELECT id, title, date, location, description
       FROM events
       WHERE id = $1`,
      [id]
    );
    return rows[0] ?? null;
  }
  
