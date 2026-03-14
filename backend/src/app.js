// =============================================================
// app.js — Express application setup
//
// Separating app setup from server startup (server.js) makes
// the app importable in tests without binding to a port.
// =============================================================

const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const { errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");

const app = express();

// ── Security / parsing middleware ────────────────────────────

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" })); // Prevent oversized payloads
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API Routes ───────────────────────────────────────────────

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);

// Tasks are nested under projects for resource-scoped GETs and POSTs
// e.g. GET /projects/:projectId/tasks
app.use("/projects/:projectId/tasks", taskRoutes);

// Standalone task mutation routes — PATCH /tasks/:id, DELETE /tasks/:id
// These need the projectId in the body since they aren't nested
app.use("/tasks", taskRoutes);

// ── 404 handler ──────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "The requested resource does not exist.",
  });
});

// ── Centralized error handler ────────────────────────────────
// Must be registered LAST so it catches errors from all routes

app.use(errorHandler);

module.exports = app;
