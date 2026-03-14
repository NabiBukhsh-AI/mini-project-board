// =============================================================
// env.js — Environment configuration with validation
//
// We validate all required env vars at startup using Zod.
// "Fail fast" means if a var is missing the server never
// starts — much better than cryptic runtime crashes later.
// =============================================================

const { z } = require("zod");
require("dotenv").config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.string().default("4000").transform(Number),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters for security"),

  JWT_EXPIRES_IN: z.string().default("24h"),

  BCRYPT_SALT_ROUNDS: z.string().default("12").transform(Number),

  FRONTEND_URL: z.string().default("http://localhost:3000"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌  Missing or invalid environment variables:");
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

module.exports = parsed.data;
