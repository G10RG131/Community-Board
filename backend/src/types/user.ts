// src/types/user.ts

/**
 * A user account in our community board.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';         // new field
  createdAt: string;
  updatedAt: string;
}

/** Payload for registering a new user */
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

/** Payload for logging in */
export interface LoginInput {
  email: string;
  password: string;
}
