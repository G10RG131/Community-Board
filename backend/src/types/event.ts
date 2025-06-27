// src/types/event.ts

/**
 * A calendar event in our community board.
 */
export interface Event {
  id: string;                      // UUID
  title: string;
  date: string;                    // ISO timestamp
  location: string;
  description?: string;
  image?: string;
  volunteerPositions: string[];    // array of volunteer position names
  userId: number;                  // ID of the submitting user
  createdAt: string;               // ISO timestamp
  updatedAt: string;               // ISO timestamp

  // ─── ADMIN WORKFLOW ───────────────────────────
  status: 'pending' | 'approved' | 'declined';
  submittedAt: string;             // when the event was submitted
  approvedBy?: number;             // admin userId who approved
}
