// =============================================================
// database.js — Prisma client singleton
//
// A single PrismaClient instance is reused across the app to
// avoid exhausting the MySQL connection pool. In development,
// we attach it to globalThis to survive hot-reloads.
// =============================================================

const { PrismaClient } = require("@prisma/client");
const env = require("./env");

const prisma =
  global.__prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });

if (env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

module.exports = prisma;
