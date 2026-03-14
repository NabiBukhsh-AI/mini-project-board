// =============================================================
// errorHandler.js — Centralized error handling middleware
//
// All errors thrown anywhere in the app flow here.
// This single exit point means consistent error shapes,
// and we never accidentally leak stack traces to clients.
//
// Error priority:
//   1. Zod validation errors   → 400
//   2. AppError (operational)  → statusCode on the error
//   3. Prisma known errors     → mapped to HTTP equivalents
//   4. Unknown errors          → 500, internals hidden
// =============================================================

const { ZodError } = require("zod");
const { Prisma } = require("@prisma/client");

// Custom error class so we can attach an HTTP status code
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    // Mark as operational — expected, user-facing errors
    this.isOperational = true;
  }
}

// Convenience subclasses for common HTTP errors
class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(message, 403);
  }
}

class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

/**
 * Express error-handling middleware.
 * Must have 4 parameters — Express identifies it by arity.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // ── Zod validation failure ──────────────────────────────
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
  }

  // ── Known operational AppErrors ─────────────────────────
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // ── Prisma known request errors ─────────────────────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A record with this value already exists.",
      });
    }
    // Record not found (e.g. findUniqueOrThrow)
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found.",
      });
    }
  }

  // ── JWT errors forwarded from middleware ─────────────────
  if (err.statusCode === 401) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }

  // ── Unexpected / programmer errors ──────────────────────
  // Log full details server-side, but never expose internals
  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred. Please try again.",
  });
};

module.exports = {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  errorHandler,
};
