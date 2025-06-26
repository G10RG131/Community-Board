/**
 * A calendar event in our community board.
 */
export interface Event {
  id: string;
  title: string;
  date: string;        // ISO 8601 date string
  location: string;
  description?: string;
  image?: string;      // URL to event image
  volunteerPositions?: string[];  // Array of volunteer position names
}

// this empty export ensures TS treats this file as a module
export {};