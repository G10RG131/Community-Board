import express from "express";
import cors from "cors";
import morgan from "morgan";

import getEventsRouter from "./routes/getEvents";
import postEventsRouter from "./routes/postEvents";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// 1) pre-route middleware
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// 2) your two routers
app.use("/events", getEventsRouter);
app.use("/events", postEventsRouter);

// 3) 404 for anything else
app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

// 4) global error handler
app.use(errorHandler);

// 5) start
const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`🗓️  Community Events backend listening on http://localhost:${PORT}`);
});
