// =============================================================
// task.service.js — Task business logic
//
// Every mutation verifies two things:
//   1. The project exists and belongs to the authenticated user
//   2. The task exists and belongs to that project
//
// This two-step check prevents horizontal privilege escalation
// (e.g. user A moving tasks into user B's project).
// =============================================================

const taskRepo = require("../repositories/task.repository");
const projectRepo = require("../repositories/project.repository");
const { NotFoundError, ForbiddenError } = require("../middleware/errorHandler");

/**
 * Verify a project exists and is owned by the user.
 * Throws appropriate errors if not.
 * Centralised so every task operation reuses the same check.
 */
const assertProjectOwnership = async (projectId, userId) => {
  const project = await projectRepo.findById(projectId);
  if (!project) throw new NotFoundError("Project");
  if (project.userId !== userId) throw new ForbiddenError();
  return project;
};

/**
 * Verify a task exists and belongs to the specified project.
 */
const assertTaskBelongsToProject = async (taskId, projectId) => {
  const task = await taskRepo.findById(taskId);
  if (!task) throw new NotFoundError("Task");
  if (task.projectId !== projectId) throw new ForbiddenError();
  return task;
};

/**
 * Get all tasks in a project with optional filtering and sorting.
 * @param {string} projectId
 * @param {string} userId
 * @param {{ status?, sortBy?, sortOrder? }} filters
 */
const getAll = async (projectId, userId, filters) => {
  await assertProjectOwnership(projectId, userId);
  return taskRepo.findAllByProject(projectId, filters);
};

/**
 * Create a task inside a project.
 */
const create = async (projectId, userId, dto) => {
  await assertProjectOwnership(projectId, userId);
  return taskRepo.create({ projectId, ...dto });
};

/**
 * Update a task.
 */
const update = async (taskId, projectId, userId, updates) => {
  await assertProjectOwnership(projectId, userId);
  await assertTaskBelongsToProject(taskId, projectId);
  return taskRepo.update(taskId, updates);
};

/**
 * Delete a task (soft).
 */
const remove = async (taskId, projectId, userId) => {
  await assertProjectOwnership(projectId, userId);
  await assertTaskBelongsToProject(taskId, projectId);
  await taskRepo.softDelete(taskId);
};

module.exports = { getAll, create, update, remove };
