// src/data/usersStore.ts
import { pool } from "../db";
import bcrypt from "bcrypt";
import type { User, CreateUserInput, LoginInput, UserResponse } from "../types/user";

/**
 * Create a new user (registration)
 */
export async function createUser(input: CreateUserInput): Promise<UserResponse> {
  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(input.password, saltRounds);

  const { rows } = await pool.query<User>(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
    [input.name, input.email, hashedPassword]
  );
  
  return rows[0];
}

/**
 * Get all users (without passwords)
 */
export async function getUsers(): Promise<UserResponse[]> {
  const { rows } = await pool.query<UserResponse>(
    `SELECT id, name, email FROM users ORDER BY name`
  );
  return rows;
}

/**
 * Get user by ID (without password)
 */
export async function getUserById(id: number): Promise<UserResponse | null> {
  const { rows } = await pool.query<UserResponse>(
    `SELECT id, name, email FROM users WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

/**
 * Get user by email (with password for authentication)
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const { rows } = await pool.query<User>(
    `SELECT id, name, email, password FROM users WHERE email = $1`,
    [email]
  );
  return rows[0] ?? null;
}

/**
 * Authenticate user login
 */
export async function authenticateUser(input: LoginInput): Promise<UserResponse | null> {
  const user = await getUserByEmail(input.email);
  
  if (!user) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(input.password, user.password);
  
  if (!isValidPassword) {
    return null;
  }

  // Return user without password
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

/**
 * Check if email already exists
 */
export async function emailExists(email: string): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT 1 FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );
  return rows.length > 0;
}
