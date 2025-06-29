// src/routes/auth.ts
import { Router } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import type { LoginInput, CreateUserInput } from "../types/user";
import {
  authenticateUser,
  createUser,
  emailExists,
} from "../data/usersStore";
import { validateBody } from "../middleware/validateBody";

const router = Router();

const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// POST /auth/register → create new user
router.post(
  "/register",
  validateBody(RegisterSchema),
  async (req, res, next) => {
    try {
      const input = req.body as CreateUserInput;
      if (await emailExists(input.email)) {
        return res.status(400).json({ error: "Email already in use" });
      }
      const user = await createUser(input);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
);

// POST /auth/login → authenticate and return JWT
router.post(
  "/login",
  validateBody(LoginSchema),
  async (req, res, next) => {
    try {
      const input = req.body as LoginInput;
      const user = await authenticateUser(input);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      // generate token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
      // return it for subsequent authenticated requests
      res.json({ token, user });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
