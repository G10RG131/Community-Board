// src/app.ts

import express from "express";
import cors from "cors";

import authRouter from "./routes/auth";
import eventsRouter from "./routes/events";
import volunteersRouter from "./routes/volunteers";
import placesRouter from "./routes/places";
import adminRouter from "./routes/admin";

import { errorHandler } from "./middleware/errorHandler";

export default function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/auth", authRouter);
  app.use("/events", eventsRouter);
  app.use("/volunteers", volunteersRouter);

  // only mount /places if key is set
  if (process.env.GOOGLE_API_KEY) {
    app.use("/places", placesRouter);
  } else {
    console.warn("GOOGLE_API_KEY is not set; skipping /places routes");
  }

  // admin approval
  app.use("/admin", adminRouter);

  // error handler (must be last)
  app.use(errorHandler);

  return app;
}
