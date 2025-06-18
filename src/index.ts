// src/index.ts
import dotenv from "dotenv";
dotenv.config();                        // 1) load .env before anything else

import createApp from "./app";

const PORT = parseInt(process.env.PORT ?? "4000", 10);
const app = createApp();

app.listen(PORT, () => {
  console.log(`🚀 Community Events backend listening on http://localhost:${PORT}`);
});
