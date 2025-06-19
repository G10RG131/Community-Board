"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
/**
 * Validates req.body against a Zod schema,
 * returns 400 + field errors if invalid,
 * otherwise replaces req.body with the parsed data.
 */
function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.format() });
        }
        req.body = result.data;
        next();
    };
}
