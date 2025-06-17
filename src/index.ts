import express from "express";
import cors from "cors";
import morgan from "morgan";
import getEventsRouter from "./routes/getEvents";
import postEventsRouter from "./routes/postEvents";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(cors());                // allow cross-origin requests
app.use(express.json());        // parse JSON bodies
app.use(morgan("tiny"));        // simple HTTP request logger

// Routes
app.use("/events", getEventsRouter);
app.use("/events", postEventsRouter);

// Centralized error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`🗓️  Community Events backend listening on http://localhost:${PORT}`);
});
