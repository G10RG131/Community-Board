// src/types/event.ts

export type EventStatus = "pending" | "approved" | "rejected";

export interface Event {
  id: string;
  title: string;
  date: string;           // ISO 8601
  location: string;
  description?: string;
  image?: string;
  volunteerPositions: string[];
  userId?: number;

  // Admin workflow
  status: EventStatus;
  submittedAt: string;    // ISO 8601 timestamp
  approvedBy: number | null;
}
