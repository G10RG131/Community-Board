/**
 * A user in our community board system.
 */
export interface User {
  id: number;          // Auto-incrementing primary key
  name: string;        // Full name of the user
  email: string;       // Email address (unique)
  password: string;    // Hashed password
}

/**
 * User data for registration (without id and with plain password)
 */
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

/**
 * User data for login
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * User data returned to client (without password)
 */
export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

// this empty export ensures TS treats this file as a module
export {};
