"use strict";
// src/__tests__/events.spec.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
let app;
let id;
beforeAll(() => {
    app = (0, app_1.default)();
});
describe("Events API", () => {
    it("POST /events → creates a new event", async () => {
        const res = await (0, supertest_1.default)(app)
            .post("/events")
            .send({
            title: "Automated Test",
            date: "2025-10-10T10:00:00Z",
            location: "Test Lab",
        })
            .set("Accept", "application/json");
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        id = res.body.id; // save for later CRUD checks
    });
    it("GET /events → returns an array", async () => {
        const res = await (0, supertest_1.default)(app).get("/events");
        expect(Array.isArray(res.body)).toBe(true);
    });
    it("GET /events/:id → fetches that event", async () => {
        const res = await (0, supertest_1.default)(app).get(`/events/${id}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
    });
    it("PATCH /events/:id → updates it", async () => {
        const res = await (0, supertest_1.default)(app)
            .patch(`/events/${id}`)
            .send({ location: "QA Lab" })
            .set("Accept", "application/json");
        expect(res.status).toBe(200);
        expect(res.body.location).toBe("QA Lab");
    });
    it("DELETE /events/:id → removes it", async () => {
        const res = await (0, supertest_1.default)(app).delete(`/events/${id}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
    });
    it("GET /events/:id → 404 after delete", async () => {
        const res = await (0, supertest_1.default)(app).get(`/events/${id}`);
        expect(res.status).toBe(404);
    });
});
