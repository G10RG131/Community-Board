// src/types/user.ts

/**
 * The shape of a user record in the database.
 * (Includes the hashed password field for internal use only.)
 */
export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
  updated_at: string;
}

/**
 * Input required to register a new user.
 */
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Input required to log in.
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * What we send back to clients after login/registration.
 * Does NOT include any password or hash.
 */
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}
