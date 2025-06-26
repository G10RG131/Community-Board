import { z } from "zod";

export interface VolunteerRegistration {
  id: number;
  eventId: string;
  userId: number;
  position: string;
  registeredAt: string;
  userName?: string;
  userEmail?: string;
}

export interface VolunteerRegistrationInput {
  eventId: string;
  position: string;
}

export interface VolunteerProfile {
  id?: number;
  userId: number;
  skills: string[];
  age: number;
  gender: string;
  contactEmail: string;
  createdAt?: string;
  isPublic?: boolean;
}

export interface VolunteerProfileInput {
  skills: string[];
  age: number;
  gender: string;
  contactEmail: string;
}

export interface PublicVolunteer {
  id: number;
  skills: string[];
  age: number;
  gender: string;
}

// Type guards
export function isVolunteerProfile(obj: any): obj is VolunteerProfile {
  return obj && 
    typeof obj.userId === 'number' &&
    Array.isArray(obj.skills) &&
    typeof obj.age === 'number' &&
    typeof obj.gender === 'string' &&
    typeof obj.contactEmail === 'string';
}

export function isPublicVolunteer(obj: any): obj is PublicVolunteer {
  return obj &&
    typeof obj.id === 'number' &&
    Array.isArray(obj.skills) &&
    typeof obj.age === 'number' &&
    typeof obj.gender === 'string';
}

// Schema validation types
export const VolunteerPositionSchema = z.object({
  name: z.string().min(1, "Position name is required"),
  description: z.string().optional(),
  quantity: z.number().int().positive().optional()
});

export type VolunteerPosition = z.infer<typeof VolunteerPositionSchema>;

// Ensure TypeScript treats this file as a module
export {};