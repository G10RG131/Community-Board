"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
/**
 * Catches anything passed to next(err)
 * and returns a 500 JSON.
 */
function errorHandler(err, _req, res, _next) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
}
