// =============================================================
// auth.service.js — Authentication business logic
//
// Services own business rules. They call repositories for
// data access and utils for cross-cutting concerns.
// Controllers should never contain logic like this.
// =============================================================

const bcrypt = require("bcryptjs");
const env = require("../config/env");
const userRepo = require("../repositories/user.repository");
const { signToken } = require("../utils/jwt");
const { ConflictError, UnauthorizedError } = require("../middleware/errorHandler");

/**
 * Register a new user.
 * Hashes the password before persisting — plaintext passwords
 * never touch the database.
 *
 * @param {{ name: string, email: string, password: string }} dto
 * @returns {{ user, token }}
 */
const register = async ({ name, email, password }) => {
  // Check for duplicate email before attempting insert
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    throw new ConflictError("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

  const user = await userRepo.create({ name, email, passwordHash });

  const token = signToken(user);

  return { user, token };
};

/**
 * Log in an existing user.
 * Uses bcrypt.compare to verify password without timing attacks.
 *
 * @param {{ email: string, password: string }} dto
 * @returns {{ user, token }}
 */
const login = async ({ email, password }) => {
  // Fetch full record (including hash) — repo's create() omits it
  const userWithHash = await userRepo.findByEmail(email);

  // Use the same error message for both "not found" and "wrong password"
  // to prevent email enumeration attacks
  if (!userWithHash) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  const passwordMatch = await bcrypt.compare(password, userWithHash.passwordHash);
  if (!passwordMatch) {
    throw new UnauthorizedError("Invalid email or password.");
  }

  // Strip the hash before building the response
  const { passwordHash: _hash, ...user } = userWithHash;

  const token = signToken(user);

  return { user, token };
};

module.exports = { register, login };
