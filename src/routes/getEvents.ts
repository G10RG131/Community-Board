// src/routes/getEvents.ts
import { Router } from "express";
import { pool } from "../db";

const router = Router();

/**
 * GET /events
 * Fetch all events from Postgres, ordered by date ascending.
 */
router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, title, date, location, description
       FROM events
       ORDER BY date ASC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
