// =============================================================
// server.js — HTTP server startup with graceful shutdown
//
// Graceful shutdown on SIGTERM/SIGINT ensures in-flight requests
// complete before the process exits — important in containers
// where the orchestrator sends SIGTERM before SIGKILL.
// =============================================================

const app = require("./app");
const env = require("./config/env");
const prisma = require("./config/database");

const server = app.listen(env.PORT, () => {
  console.log(`🚀  API running on http://localhost:${env.PORT}`);
  console.log(`📦  Environment: ${env.NODE_ENV}`);
});

const shutdown = async (signal) => {
  console.log(`\n${signal} received — shutting down gracefully`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log("✅  Database connection closed. Bye!");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Catch unhandled promise rejections to prevent silent failures
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  shutdown("unhandledRejection");
});
