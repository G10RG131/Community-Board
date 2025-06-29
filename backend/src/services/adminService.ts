// src/services/adminService.ts
import { ApiError } from "../utils/ApiError";
import {
  getPendingEvents as storeGetPending,
  approveEventById as storeApprove,
  rejectEventById as storeReject,
} from "../data/adminStore";
import { sendEmail } from "./emailService";
import { pool } from "../db";
import type { Event } from "../types/event";

// List pending events
export async function listPendingEvents(): Promise<Event[]> {
  return storeGetPending();
}

// Approve + throw 404 if missing + notify organizer
export async function approveEvent(id: string, adminId: number): Promise<Event> {
  const evt = await storeApprove(id, adminId);
  if (!evt) throw new ApiError(404, "Event not found");

  // Look up organizer email
  if (evt.userId) {
    const { rows } = await pool.query<{ email: string }>(
      `SELECT email FROM users WHERE id = $1`,
      [evt.userId]
    );
    const email = rows[0]?.email;
    if (email) {
      await sendEmail({
        to: email,
        subject: "Your event has been approved 🎉",
        text: `Hi there,\n\nYour event "${evt.title}" was approved by our team. See you there!\n`,
      });
    }
  }

  return evt;
}

// Reject + throw 404 if missing + notify organizer
export async function rejectEvent(id: string, adminId: number): Promise<Event> {
  const evt = await storeReject(id, adminId);
  if (!evt) throw new ApiError(404, "Event not found");

  // Look up organizer email
  if (evt.userId) {
    const { rows } = await pool.query<{ email: string }>(
      `SELECT email FROM users WHERE id = $1`,
      [evt.userId]
    );
    const email = rows[0]?.email;
    if (email) {
      await sendEmail({
        to: email,
        subject: "Your event was rejected",
        text: `Hi there,\n\nWe’re sorry to let you know your event "${evt.title}" was rejected. Please review our guidelines and resubmit.\n`,
      });
    }
  }

  return evt;
}
