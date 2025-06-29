// src/data/usersStore.ts
import { pool } from "../db"
import bcrypt from "bcrypt"
import type { CreateUserInput, LoginInput, UserResponse } from "../types/user"

/**
 * Insert a new user, hashing their password.
 */
export async function createUser(input: CreateUserInput): Promise<UserResponse> {
  const hash = await bcrypt.hash(input.password, 10)
  const { rows } = await pool.query<{
    id: number
    name: string
    email: string
    role: string
  }>(
    `INSERT INTO users (name, email, password, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [input.name, input.email, input.password, hash]
  )
  return rows[0]
}

/**
 * Fetch the full user row by email.
 */
export async function getUserByEmail(
  email: string
): Promise<{
  id: number
  name: string
  email: string
  password: string | null
  password_hash: string | null
  role: string
} | null> {
  const { rows } = await pool.query<{
    id: number
    name: string
    email: string
    password: string | null
    password_hash: string | null
    role: string
  }>(
    `SELECT id, name, email, password, password_hash, role
     FROM users WHERE email = $1`,
    [email]
  )
  return rows[0] || null
}

/**
 * Verify credentials and return a UserResponse.
 * If there's a bcrypt hash, compare against it; otherwise fall back to raw password.
 */
export async function authenticateUser(
  input: LoginInput
): Promise<UserResponse> {
  const rec = await getUserByEmail(input.email)
  if (!rec) throw new Error("Invalid credentials")

  if (rec.password_hash) {
    const ok = await bcrypt.compare(input.password, rec.password_hash)
    if (!ok) throw new Error("Invalid credentials")
  } else {
    if (rec.password !== input.password) throw new Error("Invalid credentials")
  }

  return {
    id: rec.id,
    name: rec.name,
    email: rec.email,
    role: rec.role,
  }
}

/**
 * Check whether an email is already in use.
 */
export async function emailExists(email: string): Promise<boolean> {
  const rec = await getUserByEmail(email)
  return !!rec
}
