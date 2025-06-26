// src/routes/auth.ts
import { Router } from "express";
import { z } from "zod";
import type { LoginInput, CreateUserInput } from "../types/user";
import { authenticateUser, createUser, emailExists } from "../data/usersStore";
import { validateBody } from "../middleware/validateBody";

const router = Router();

// Registration schema
const RegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Login schema
const LoginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

/** POST /auth/register → Register new user */
router.post("/register", validateBody(RegisterSchema), async (req, res, next) => {
  try {
    const input: CreateUserInput = req.body;

    // Check if email already exists
    const exists = await emailExists(input.email);
    if (exists) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already registered" 
      });
    }

    const user = await createUser(input);
    res.status(201).json({
      success: true,
      message: "Registration successful",
      user
    });
  } catch (e) {
    next(e);
  }
});

/** POST /auth/login → Authenticate user */
router.post("/login", validateBody(LoginSchema), async (req, res, next) => {
  try {
    const input: LoginInput = req.body;
    
    const user = await authenticateUser(input);
    
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
  } catch (e) {
    next(e);
  }
});

export default router;
