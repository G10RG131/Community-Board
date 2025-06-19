"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = createEvent;
exports.getEvents = getEvents;
exports.deleteEventById = deleteEventById;
exports.getEventById = getEventById;
exports.updateEventById = updateEventById;
// src/data/eventsStore.ts
const crypto_1 = require("crypto");
const db_1 = require("../db");
async function createEvent(input) {
    const newId = (0, crypto_1.randomUUID)();
    const { rows } = await db_1.pool.query(`INSERT INTO events (id, title, date, location, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`, [newId, input.title, input.date, input.location, input.description]);
    return rows[0];
}
async function getEvents() {
    const { rows } = await db_1.pool.query(`SELECT id, title, date, location, description
     FROM events
     ORDER BY date`);
    return rows;
}
/**
 * Delete the event with the given ID.
 * @param id Event UUID
 * @returns The deleted event, or null if none existed.
 */
async function deleteEventById(id) {
    const { rows } = await db_1.pool.query(`DELETE FROM events
       WHERE id = $1
       RETURNING id, title, date, location, description`, [id]);
    return rows[0] ?? null;
}
/**
 * Fetch a single event by its ID.
 * @param id Event UUID
 * @returns The event, or null if none found.
 */
async function getEventById(id) {
    const { rows } = await db_1.pool.query(`SELECT id, title, date, location, description
       FROM events
       WHERE id = $1`, [id]);
    return rows[0] ?? null;
}
/**
* Update any subset of {title, date, location, description} on an event.
* Returns the updated row, or null if the ID wasn’t found.
*/
async function updateEventById(id, updates) {
    const { rows } = await db_1.pool.query(`UPDATE events
         SET
           title       = COALESCE($2, title),
           date        = COALESCE($3, date),
           location    = COALESCE($4, location),
           description = COALESCE($5, description)
       WHERE id = $1
       RETURNING id, title, date, location, description`, [
        id,
        updates.title,
        updates.date,
        updates.location,
        updates.description,
    ]);
    return rows[0] ?? null;
}
