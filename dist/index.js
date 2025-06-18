"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // 1) load .env before anything else
const app_1 = __importDefault(require("./app"));
const PORT = parseInt(process.env.PORT ?? "4000", 10);
const app = (0, app_1.default)();
app.listen(PORT, () => {
    console.log(`🚀 Community Events backend listening on http://localhost:${PORT}`);
});
