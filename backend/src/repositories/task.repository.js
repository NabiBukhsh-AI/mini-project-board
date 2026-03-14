// =============================================================
// task.repository.js
//
// All database access for the Task model.
// Supports dynamic filtering (status) and sorting
// (dueDate, priority) via query parameters.
//
// Priority sorting is implemented with a raw CASE expression
// because Prisma cannot order by enum rank out-of-the-box.
// =============================================================

const prisma = require("../config/database");

/** Base filter to exclude soft-deleted rows */
const notDeleted = { deletedAt: null };

/**
 * Priority display order for sorting: high > medium > low
 * Maps enum values to numeric weights for CASE expression.
 */
const PRIORITY_ORDER = { high: 1, medium: 2, low: 3 };

/**
 * Build the Prisma `orderBy` clause from query params.
 * Falls back to createdAt desc if no valid sortBy is given.
 *
 * Note: priority sorting requires a special workaround since
 * Prisma doesn't support enum rank ordering directly.
 */
const buildOrderBy = (sortBy, sortOrder = "asc") => {
  const order = sortOrder === "desc" ? "desc" : "asc";

  switch (sortBy) {
    case "dueDate":
      // Tasks without a dueDate are sorted to the end
      return [{ dueDate: order }, { createdAt: "desc" }];
    case "priority":
      // We handle priority ordering in the repository using
      // a raw query — see findAllByProject below
      return null; // signal to use raw ordering
    case "title":
      return [{ title: order }];
    default:
      return [{ createdAt: "desc" }];
  }
};

/**
 * Get all active tasks for a project with optional filtering and sorting.
 * @param {string} projectId
 * @param {{ status?: string, sortBy?: string, sortOrder?: string }} filters
 */
const findAllByProject = async (projectId, filters = {}) => {
  const { status, sortBy, sortOrder } = filters;

  const where = {
    projectId,
    ...notDeleted,
    ...(status ? { status } : {}),
  };

  const select = {
    id: true,
    projectId: true,
    title: true,
    description: true,
    status: true,
    priority: true,
    dueDate: true,
    createdAt: true,
    updatedAt: true,
  };

  // Priority has no natural DB sort order for enums, so fetch then sort in JS.
  // This is fine at task-board scale and avoids fragile raw SQL.
  if (sortBy === "priority") {
    const PRIORITY_WEIGHT = { high: 1, medium: 2, low: 3 };
    const direction = sortOrder === "desc" ? -1 : 1;

    const tasks = await prisma.task.findMany({ where, select });

    return tasks.sort((a, b) => {
      const diff = (PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]) * direction;
      // Secondary sort: newest first when priority is equal
      return diff !== 0 ? diff : new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  const orderBy = buildOrderBy(sortBy, sortOrder);

  return prisma.task.findMany({ where, orderBy, select });
};

/**
 * Find a single task by id.
 */
const findById = (id) => {
  return prisma.task.findFirst({
    where: { id, ...notDeleted },
  });
};

/**
 * Create a new task in a project.
 */
const create = ({ projectId, title, description, status, priority, dueDate }) => {
  return prisma.task.create({
    data: {
      projectId,
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
    select: {
      id: true,
      projectId: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Update mutable fields on a task.
 */
const update = (id, { title, description, status, priority, dueDate }) => {
  const data = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (status !== undefined) data.status = status;
  if (priority !== undefined) data.priority = priority;
  if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;

  return prisma.task.update({
    where: { id },
    data,
    select: {
      id: true,
      projectId: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Soft-delete a task.
 */
const softDelete = (id) => {
  return prisma.task.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

module.exports = {
  findAllByProject,
  findById,
  create,
  update,
  softDelete,
};