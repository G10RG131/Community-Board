import express from "express";
import cors from "cors";
import morgan from "morgan";
import eventsRouter from "./routes/events";
import authRouter from "./routes/auth";
import volunteersRouter from "./routes/volunteers";
import { errorHandler } from "./middleware/errorHandler";

export default function createApp() {
  const app = express();

  // 1) Pre-route middleware
  app.use(cors());            // allow cross-origin requests
  app.use(express.json());    // parse JSON bodies
  app.use(morgan("tiny"));    // simple HTTP request logger

  // 2) All /events routes (GET, POST, PATCH, DELETE)
  app.use("/events", eventsRouter);
  
  // 3) All /auth routes (POST /login, POST /register)
  app.use("/auth", authRouter);

  // 4) All /volunteers routes (POST /register, DELETE /unregister, GET /event/:id, GET /my-events)
  app.use("/volunteers", volunteersRouter);

  // 5) Catch-all 404
  app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

  // 6) Centralized error handler
  app.use(errorHandler);

  return app;
}
