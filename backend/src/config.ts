// src/config.ts
import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || "3000",
  dbUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  googleApiKey: process.env.GOOGLE_API_KEY || "",
};
