// src/services/volunteerService.ts
import { ApiError } from "../utils/ApiError";
import {
  registerVolunteer as storeRegister,
  unregisterVolunteer as storeUnregister,
  getVolunteersByEventId as storeGetByEvent,
  getVolunteersForUserEvents as storeGetMyEvents,
  isUserRegistered,
} from "../data/volunteerStore";

export async function registerVolunteer(
  eventId: string,
  position: string,
  userId: number
) {
  if (await isUserRegistered(eventId, userId, position)) {
    throw new ApiError(400, "Already registered for this position");
  }
  return storeRegister({ eventId, position }, userId);
}

export async function unregisterVolunteer(
  eventId: string,
  position: string,
  userId: number
) {
  const ok = await storeUnregister(eventId, userId, position);
  if (!ok) {
    throw new ApiError(404, "Registration not found");
  }
  return { message: "Unregistered successfully" };
}

export async function getVolunteersByEvent(eventId: string) {
  return storeGetByEvent(eventId);
}

export async function getMyEventVolunteers(userId: number) {
  return storeGetMyEvents(userId);
}
