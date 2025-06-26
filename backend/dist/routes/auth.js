"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.ts
const express_1 = require("express");
const zod_1 = require("zod");
const usersStore_1 = require("../data/usersStore");
const validateBody_1 = require("../middleware/validateBody");
const router = (0, express_1.Router)();
// Registration schema
const RegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Valid email is required"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
// Login schema
const LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Valid email is required"),
    password: zod_1.z.string().min(1, "Password is required"),
});
/** POST /auth/register → Register new user */
router.post("/register", (0, validateBody_1.validateBody)(RegisterSchema), async (req, res, next) => {
    try {
        const input = req.body;
        // Check if email already exists
        const exists = await (0, usersStore_1.emailExists)(input.email);
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }
        const user = await (0, usersStore_1.createUser)(input);
        res.status(201).json({
            success: true,
            message: "Registration successful",
            user
        });
    }
    catch (e) {
        next(e);
    }
});
/** POST /auth/login → Authenticate user */
router.post("/login", (0, validateBody_1.validateBody)(LoginSchema), async (req, res, next) => {
    try {
        const input = req.body;
        const user = await (0, usersStore_1.authenticateUser)(input);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        res.json({
            success: true,
            message: "Login successful",
            user
        });
    }
    catch (e) {
        next(e);
    }
});
exports.default = router;
