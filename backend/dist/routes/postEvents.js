"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/postEvents.ts
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = require("../db");
const router = (0, express_1.Router)();
// validate incoming payload
const EventSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    date: zod_1.z.string().refine(d => !isNaN(Date.parse(d)), { message: "Invalid date format" }),
    location: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
});
const postEventsHandler = async (req, res, next) => {
    const parsed = EventSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.format() });
    }
    try {
        const { title, date, location, description } = parsed.data;
        // INSERT ... RETURNING * to get the full row back
        const { rows } = await db_1.pool.query(`INSERT INTO events (id, title, date, location, description)
       VALUES (gen_random_uuid(), $1, $2, $3, $4)
       RETURNING id, title, date, location, description`, [title, date, location, description]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        next(err);
    }
};
router.post("/", postEventsHandler);
exports.default = router;
