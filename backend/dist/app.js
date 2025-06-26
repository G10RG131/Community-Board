"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const events_1 = __importDefault(require("./routes/events"));
const auth_1 = __importDefault(require("./routes/auth"));
const volunteers_1 = __importDefault(require("./routes/volunteers"));
const errorHandler_1 = require("./middleware/errorHandler");
function createApp() {
    const app = (0, express_1.default)();
    // 1) Pre-route middleware
    app.use((0, cors_1.default)()); // allow cross-origin requests
    app.use(express_1.default.json()); // parse JSON bodies
    app.use((0, morgan_1.default)("tiny")); // simple HTTP request logger
    // 2) All /events routes (GET, POST, PATCH, DELETE)
    app.use("/events", events_1.default);
    // 3) All /auth routes (POST /login, POST /register)
    app.use("/auth", auth_1.default);
    // 4) All /volunteers routes (POST /register, DELETE /unregister, GET /event/:id, GET /my-events)
    app.use("/volunteers", volunteers_1.default);
    // 5) Catch-all 404
    app.use((_req, res) => res.status(404).json({ error: "Not Found" }));
    // 6) Centralized error handler
    app.use(errorHandler_1.errorHandler);
    return app;
}
