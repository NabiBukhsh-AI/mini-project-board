// =============================================================
// jwt.js — JWT sign / verify utilities
//
// Wrapping jsonwebtoken in our own helpers keeps the rest of
// the app decoupled from the jwt library. If we ever switch
// libraries, only this file changes.
// =============================================================

const jwt = require("jsonwebtoken");
const env = require("../config/env");

/**
 * Signs a JWT with the user's id, email, and returns the token.
 * @param {{ id: string, email: string }} user
 * @returns {string}
 */
const signToken = (user) => {
  return jwt.sign(
    { sub: user.id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

/**
 * Verifies a JWT and returns the decoded payload.
 * Throws an error with a user-friendly message on failure.
 * @param {string} token
 * @returns {{ sub: string, email: string }}
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const error = new Error("Token has expired. Please log in again.");
      error.statusCode = 401;
      throw error;
    }
    const error = new Error("Invalid token. Please log in again.");
    error.statusCode = 401;
    throw error;
  }
};

module.exports = { signToken, verifyToken };
