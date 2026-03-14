// =============================================================
// project.service.js — Project business logic
//
// Ownership is enforced here, not in the controller.
// This means if we ever add a second access path (e.g. admin
// panel, queue worker), security is still enforced centrally.
// =============================================================

const projectRepo = require("../repositories/project.repository");
const { NotFoundError, ForbiddenError } = require("../middleware/errorHandler");

/**
 * Get all projects owned by the authenticated user.
 */
const getAll = (userId) => {
  return projectRepo.findAllByUser(userId);
};

/**
 * Get a single project, enforcing ownership.
 */
const getOne = async (projectId, userId) => {
  const project = await projectRepo.findByIdAndUser(projectId, userId);
  if (!project) {
    throw new NotFoundError("Project");
  }
  return project;
};

/**
 * Create a new project for the authenticated user.
 */
const create = ({ userId, name, description }) => {
  return projectRepo.create({ userId, name, description });
};

/**
 * Rename / update a project.
 * First verifies the project exists and belongs to the user.
 */
const update = async (projectId, userId, updates) => {
  const project = await projectRepo.findById(projectId);

  if (!project) {
    throw new NotFoundError("Project");
  }

  // Ownership check — prevents users from mutating others' projects
  if (project.userId !== userId) {
    throw new ForbiddenError();
  }

  return projectRepo.update(projectId, updates);
};

/**
 * Soft-delete a project.
 * Verifies ownership before deletion.
 */
const remove = async (projectId, userId) => {
  const project = await projectRepo.findById(projectId);

  if (!project) {
    throw new NotFoundError("Project");
  }

  if (project.userId !== userId) {
    throw new ForbiddenError();
  }

  await projectRepo.softDelete(projectId);
};

module.exports = { getAll, getOne, create, update, remove };
