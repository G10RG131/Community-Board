// src/services/adminService.ts
import { EventEmitter } from "events";
import { ApiError } from "../utils/ApiError";
import {
  getPendingEvents as storeGetPending,
  approveEventById as storeApprove,
  rejectEventById as storeReject,
} from "../data/adminStore";
import { sendEmail } from "./emailService";
import { pool } from "../db";
import type { Event } from "../types/event";

// Event bus for moderation metrics
export const adminBus = new EventEmitter();

// List pending events
export async function listPendingEvents(): Promise<Event[]> {
  return storeGetPending();
}

// Approve + throw 404 + notify organizer + pass reason + emit metric
export async function approveEvent(
  id: string,
  adminId: number,
  reason?: string
): Promise<Event> {
  const evt = await storeApprove(id, adminId, reason);
  if (!evt) throw new ApiError(404, "Event not found");

  // emit for metrics
  adminBus.emit("moderation", {
    action: "approved",
    adminId,
    eventId: id,
    timestamp: new Date(),
  });

  // notify organizer
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
        text: `Hi there,

Your event "${evt.title}" was approved by our team.${
  reason ? `\n\nReason: ${reason}` : ""
}
`,
      });
    }
  }

  return evt;
}

// Reject + throw 404 + notify organizer + pass reason + emit metric
export async function rejectEvent(
  id: string,
  adminId: number,
  reason?: string
): Promise<Event> {
  const evt = await storeReject(id, adminId, reason);
  if (!evt) throw new ApiError(404, "Event not found");

  adminBus.emit("moderation", {
    action: "rejected",
    adminId,
    eventId: id,
    timestamp: new Date(),
  });

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
        text: `Hi there,

Your event "${evt.title}" was rejected.${
  reason ? `\n\nReason: ${reason}` : ""
}
Please review our guidelines and resubmit.
`,
      });
    }
  }

  return evt;
}
