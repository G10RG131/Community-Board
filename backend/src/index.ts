// src/index.ts
import createApp from "./app";
import { pool } from "./db";

const app = createApp();
const PORT = process.env.PORT || 4000;

(async () => {
  // optional: test DB connection
  await pool.connect();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
