// src/types/express.d.ts
import type { UserResponse } from "./user";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserResponse;
  }
}
