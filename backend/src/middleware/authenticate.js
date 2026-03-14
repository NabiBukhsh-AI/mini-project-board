// =============================================================
// authenticate.js — JWT authentication middleware
//
// Extracts the Bearer token from Authorization header,
// verifies it, and attaches the decoded user to req.user.
// All protected routes must use this middleware.
// =============================================================

const { verifyToken } = require("../utils/jwt");
const { UnauthorizedError } = require("./errorHandler");

/**
 * Protects a route by requiring a valid JWT.
 * On success: populates req.user = { id, email }
 * On failure: passes an UnauthorizedError to next()
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("No token provided. Please log in."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    // Attach a minimal user object — only what routes need
    req.user = {
      id: payload.sub,
      email: payload.email,
    };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authenticate };
