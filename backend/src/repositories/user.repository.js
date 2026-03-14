// =============================================================
// user.repository.js
//
// All database access for the User model lives here.
// Services call repositories — never Prisma directly.
// This makes the data layer swappable and independently
// testable (mock the repository, not Prisma).
// =============================================================

const prisma = require("../config/database");

/**
 * Find a user by their email address.
 * Used during login and duplicate-email checks.
 */
const findByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};

/**
 * Find a user by their primary key.
 */
const findById = (id) => {
  return prisma.user.findUnique({ where: { id } });
};

/**
 * Create a new user.
 * @param {{ name: string, email: string, passwordHash: string }} data
 */
const create = (data) => {
  return prisma.user.create({
    data,
    // Never return the password hash to callers
    select: { id: true, name: true, email: true, createdAt: true },
  });
};

module.exports = { findByEmail, findById, create };
