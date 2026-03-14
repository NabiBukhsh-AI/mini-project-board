const { z } = require("zod");

const createProjectSchema = z.object({
  name: z
    .string({ required_error: "Project name is required" })
    .min(1, "Project name cannot be empty")
    .max(200, "Project name must be under 200 characters")
    .trim(),

  description: z
    .string()
    .max(2000, "Description must be under 2000 characters")
    .trim()
    .optional(),
});

// PATCH — all fields optional, but at least one must be present
const updateProjectSchema = z
  .object({
    name: z
      .string()
      .min(1, "Project name cannot be empty")
      .max(200)
      .trim()
      .optional(),

    description: z.string().max(2000).trim().nullable().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided for update" }
  );

module.exports = { createProjectSchema, updateProjectSchema };
