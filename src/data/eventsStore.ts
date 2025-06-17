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
