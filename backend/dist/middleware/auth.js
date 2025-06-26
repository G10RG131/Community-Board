"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireAuth = void 0;
// Simple authentication middleware - in a real app you'd use JWT tokens
const requireAuth = (req, res, next) => {
    const userHeader = req.headers['x-user-id'];
    const userNameHeader = req.headers['x-user-name'];
    const userEmailHeader = req.headers['x-user-email'];
    if (!userHeader || !userNameHeader || !userEmailHeader) {
        return res.status(401).json({ error: "Authentication required" });
    }
    req.user = {
        id: parseInt(userHeader),
        name: userNameHeader,
        email: userEmailHeader
    };
    next();
};
exports.requireAuth = requireAuth;
// Optional auth middleware - sets user if present but doesn't require it
const optionalAuth = (req, res, next) => {
    const userHeader = req.headers['x-user-id'];
    const userNameHeader = req.headers['x-user-name'];
    const userEmailHeader = req.headers['x-user-email'];
    if (userHeader && userNameHeader && userEmailHeader) {
        req.user = {
            id: parseInt(userHeader),
            name: userNameHeader,
            email: userEmailHeader
        };
    }
    next();
};
exports.optionalAuth = optionalAuth;
