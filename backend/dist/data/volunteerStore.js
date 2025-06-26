"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerVolunteer = registerVolunteer;
exports.getVolunteersByEventId = getVolunteersByEventId;
exports.getVolunteersForUserEvents = getVolunteersForUserEvents;
exports.unregisterVolunteer = unregisterVolunteer;
exports.isUserRegistered = isUserRegistered;
exports.cleanupRemovedPositions = cleanupRemovedPositions;
// src/data/volunteerStore.ts
const db_1 = require("../db");
/**
 * Register a user as a volunteer for a specific position in an event
 */
async function registerVolunteer(input, userId) {
    const { rows } = await db_1.pool.query(`INSERT INTO volunteer_registrations (event_id, user_id, position)
     VALUES ($1, $2, $3)
     RETURNING id, event_id, user_id, position, registered_at`, [input.eventId, userId, input.position]);
    const registration = rows[0];
    return {
        id: registration.id,
        eventId: registration.event_id,
        userId: registration.user_id,
        position: registration.position,
        registeredAt: registration.registered_at
    };
}
/**
 * Get all volunteer registrations for a specific event
 */
async function getVolunteersByEventId(eventId) {
    const { rows } = await db_1.pool.query(`SELECT vr.id, vr.event_id, vr.user_id, vr.position, vr.registered_at,
            u.name as user_name, u.email as user_email
     FROM volunteer_registrations vr
     JOIN users u ON vr.user_id = u.id
     WHERE vr.event_id = $1
     ORDER BY vr.registered_at`, [eventId]);
    return rows.map(row => ({
        id: row.id,
        eventId: row.event_id,
        userId: row.user_id,
        position: row.position,
        registeredAt: row.registered_at,
        userName: row.user_name,
        userEmail: row.user_email
    }));
}
/**
 * Get all volunteer registrations for events created by a specific user
 */
async function getVolunteersForUserEvents(userId) {
    const { rows } = await db_1.pool.query(`SELECT vr.id, vr.event_id, vr.user_id, vr.position, vr.registered_at,
            u.name as user_name, u.email as user_email, e.title as event_title
     FROM volunteer_registrations vr
     JOIN users u ON vr.user_id = u.id
     JOIN events e ON vr.event_id = e.id
     WHERE e.user_id = $1
     ORDER BY e.date, vr.registered_at`, [userId]);
    // Group by event
    const eventVolunteers = {};
    rows.forEach(row => {
        const eventId = row.event_id;
        if (!eventVolunteers[eventId]) {
            eventVolunteers[eventId] = [];
        }
        eventVolunteers[eventId].push({
            id: row.id,
            eventId: row.event_id,
            userId: row.user_id,
            position: row.position,
            registeredAt: row.registered_at,
            userName: row.user_name,
            userEmail: row.user_email
        });
    });
    return Object.entries(eventVolunteers).map(([eventId, volunteers]) => ({
        eventId,
        volunteers
    }));
}
/**
 * Remove a volunteer registration
 */
async function unregisterVolunteer(eventId, userId, position) {
    const { rowCount } = await db_1.pool.query(`DELETE FROM volunteer_registrations
     WHERE event_id = $1 AND user_id = $2 AND position = $3`, [eventId, userId, position]);
    return (rowCount ?? 0) > 0;
}
/**
 * Check if a user is already registered for a specific position in an event
 */
async function isUserRegistered(eventId, userId, position) {
    const { rows } = await db_1.pool.query(`SELECT 1 FROM volunteer_registrations
     WHERE event_id = $1 AND user_id = $2 AND position = $3`, [eventId, userId, position]);
    return rows.length > 0;
}
/**
 * Remove volunteer registrations for positions that no longer exist in an event
 */
async function cleanupRemovedPositions(eventId, currentPositions) {
    // Get all current volunteer registrations for this event
    const currentVolunteers = await getVolunteersByEventId(eventId);
    // Find registrations for positions that no longer exist
    const volunteersToRemove = currentVolunteers.filter(volunteer => !currentPositions.includes(volunteer.position));
    // Remove these registrations
    for (const volunteer of volunteersToRemove) {
        await db_1.pool.query(`DELETE FROM volunteer_registrations
       WHERE event_id = $1 AND user_id = $2 AND position = $3`, [eventId, volunteer.userId, volunteer.position]);
    }
}
