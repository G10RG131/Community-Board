// src/__tests__/admin.spec.ts
import request from "supertest";
import { pool } from "../db";
import createApp from "../app";

// @ts-ignore
const { initializeDatabase } = require("../../scripts/init-database");

describe("Admin Approval API", () => {
  let app = createApp();
  let authHeaders: Record<string, string>;
  let eventId: string;

  beforeAll(async () => {
    // 1) Drop & recreate the public schema
    await pool.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);

    // 2) Re-run migrations (adds status & submitted_at defaults)
    await initializeDatabase();

    // 3) Recreate our app instance
    app = createApp();

    // 4) Log in as the seeded admin user
    const login = await request(app)
      .post("/auth/login")
      .send({ email: "admin@example.com", password: "changeme" });

    authHeaders = { Authorization: `Bearer ${login.body.token}` };

    // 5) Insert one pending event — rely on DB defaults for status/submitted_at
    const res = await pool.query<{
      id: string;
    }>(
      `
      INSERT INTO events (
        id, title, date, location,
        description, image, volunteer_positions, user_id
      )
      VALUES (
        gen_random_uuid(), $1, $2, $3,
        $4, $5, $6, NULL
      )
      RETURNING id
      `,
      [
        "Admin Test Event",
        new Date().toISOString(),
        "Testville",
        "Testing the admin workflow",
        null,
        "[]",
      ]
    );

    eventId = res.rows[0].id;
  });

  afterAll(async () => {
    await pool.end();
  });

  it("GET /admin/events/pending → should list our pending event", async () => {
    const res = await request(app)
      .get("/admin/events/pending")
      .set(authHeaders);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const ids = res.body.map((e: any) => e.id);
    expect(ids).toContain(eventId);
  });

  it("POST /admin/events/:id/approve → approves the event", async () => {
    const res = await request(app)
      .post(`/admin/events/${eventId}/approve`)
      .set(authHeaders);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: eventId,
      status: "approved",
    });
  });

  it("POST /admin/events/:id/approve → 404 for unknown ID", async () => {
    const res = await request(app)
      .post(`/admin/events/00000000-0000-0000-0000-000000000000/approve`)
      .set(authHeaders);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Event not found");
  });

  it("POST /admin/events/:id/reject → rejects the event", async () => {
    // seed another pending row
    const ins = await pool.query<{ id: string }>(
      `
      INSERT INTO events (
        id, title, date, location,
        description, image, volunteer_positions, user_id
      )
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NULL)
      RETURNING id
      `,
      [
        "Admin Reject Test",
        new Date().toISOString(),
        "Rejectville",
        "Testing rejection",
        null,
        "[]",
      ]
    );
    const rejectId = ins.rows[0].id;

    const res = await request(app)
      .post(`/admin/events/${rejectId}/reject`)
      .set(authHeaders);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: rejectId,
      status: "rejected",
    });
  });

  it("POST /admin/events/:id/reject → 404 for unknown ID", async () => {
    const res = await request(app)
      .post(`/admin/events/00000000-0000-0000-0000-000000000000/reject`)
      .set(authHeaders);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Event not found");
  });
});
