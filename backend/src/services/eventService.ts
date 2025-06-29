// src/services/eventService.ts
import { ApiError } from "../utils/ApiError";
import {
  createEvent   as storeCreateEvent,
  getEvents     as storeGetEvents,
  getEventById  as storeGetById,
  updateEventById as storeUpdateById,
  deleteEventById as storeDeleteEventById,
} from "../data/eventsStore";
import type { Event } from "../types/event";

//
// Our “input” for create/update is exactly everything on Event
// except the auto-generated and admin fields.
// We alias it here for clarity:
//
type NewEventData = Omit<
  Event,
  "id" | "status" | "submittedAt" | "approvedBy"
>;

/** Create a new event (any authenticated user) */
export async function createEvent(
  input: NewEventData,
  userId: number
): Promise<Event> {
  return storeCreateEvent(input, userId);
}

/** List all events */
export async function getAllEvents(): Promise<Event[]> {
  return storeGetEvents();
}

/** Fetch one event or 404 */
export async function getEventById(id: string): Promise<Event> {
  const evt = await storeGetById(id);
  if (!evt) throw new ApiError(404, "Event not found");
  return evt;
}

/** Update an event’s own fields, or 404 */
export async function updateEvent(
  id: string,
  updates: Partial<NewEventData>
): Promise<Event> {
  const updated = await storeUpdateById(id, updates);
  if (!updated) throw new ApiError(404, "Event not found");
  return updated;
}

/** Delete an event, or 404 */
export async function deleteEvent(id: string): Promise<{ message: string }> {
  const deleted = await storeDeleteEventById(id);
  if (!deleted) throw new ApiError(404, "Event not found");
  // the store returns the deleted Event; we can return a simple message instead
  return { message: "Deleted successfully" };
}
