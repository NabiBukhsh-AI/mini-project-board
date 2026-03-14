const { z } = require("zod");

const TASK_STATUSES = ["todo", "in_progress", "done"];
const TASK_PRIORITIES = ["low", "medium", "high"];

const createTaskSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title cannot be empty")
    .max(300, "Title must be under 300 characters")
    .trim(),

  description: z
    .string()
    .max(5000, "Description must be under 5000 characters")
    .trim()
    .optional(),

  status: z
    .enum(TASK_STATUSES, {
      errorMap: () => ({ message: `Status must be one of: ${TASK_STATUSES.join(", ")}` }),
    })
    .optional(),

  priority: z
    .enum(TASK_PRIORITIES, {
      errorMap: () => ({ message: `Priority must be one of: ${TASK_PRIORITIES.join(", ")}` }),
    })
    .optional(),

  dueDate: z
    .string()
    .datetime({ message: "dueDate must be a valid ISO 8601 date string" })
    .optional()
    .nullable(),
});

const updateTaskSchema = z
  .object({
    // projectId is required so the service can verify project ownership.
    // It must be included in the request body for PATCH /tasks/:id
    projectId: z.string().uuid("projectId must be a valid UUID"),
    title: z.string().min(1).max(300).trim().optional(),
    description: z.string().max(5000).trim().nullable().optional(),
    status: z.enum(TASK_STATUSES).optional(),
    priority: z.enum(TASK_PRIORITIES).optional(),
    dueDate: z
      .string()
      .datetime({ message: "dueDate must be a valid ISO 8601 date string" })
      .nullable()
      .optional(),
  })
  .refine(
    // Ensure at least one actual update field is present (not just projectId)
    (data) => Object.keys(data).filter((k) => k !== "projectId").length > 0,
    { message: "At least one field must be provided for update" }
  );

module.exports = { createTaskSchema, updateTaskSchema, TASK_STATUSES, TASK_PRIORITIES };