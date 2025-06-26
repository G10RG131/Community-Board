// src/types/volunteer.ts

export interface VolunteerRegistration {
  id: number;
  eventId: string;
  userId: number;
  position: string;
  registeredAt: string;
  userName?: string;  // User name for display purposes
  userEmail?: string; // User email for display purposes
}

export interface VolunteerRegistrationInput {
  eventId: string;
  position: string;
}

// this empty export ensures TS treats this file as a module
export {};
