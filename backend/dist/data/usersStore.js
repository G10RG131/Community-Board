"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.getUserByEmail = getUserByEmail;
exports.authenticateUser = authenticateUser;
exports.emailExists = emailExists;
// src/data/usersStore.ts
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Create a new user (registration)
 */
async function createUser(input) {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt_1.default.hash(input.password, saltRounds);
    const { rows } = await db_1.pool.query(`INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`, [input.name, input.email, hashedPassword]);
    return rows[0];
}
/**
 * Get all users (without passwords)
 */
async function getUsers() {
    const { rows } = await db_1.pool.query(`SELECT id, name, email FROM users ORDER BY name`);
    return rows;
}
/**
 * Get user by ID (without password)
 */
async function getUserById(id) {
    const { rows } = await db_1.pool.query(`SELECT id, name, email FROM users WHERE id = $1`, [id]);
    return rows[0] ?? null;
}
/**
 * Get user by email (with password for authentication)
 */
async function getUserByEmail(email) {
    const { rows } = await db_1.pool.query(`SELECT id, name, email, password FROM users WHERE email = $1`, [email]);
    return rows[0] ?? null;
}
/**
 * Authenticate user login
 */
async function authenticateUser(input) {
    const user = await getUserByEmail(input.email);
    if (!user) {
        return null;
    }
    const isValidPassword = await bcrypt_1.default.compare(input.password, user.password);
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
async function emailExists(email) {
    const { rows } = await db_1.pool.query(`SELECT 1 FROM users WHERE email = $1 LIMIT 1`, [email]);
    return rows.length > 0;
}
