// =============================================================
// project.repository.js
//
// All database access for the Project model.
// Soft-delete pattern: deletedAt === null means "active".
// All queries filter on deletedAt to honour this contract.
// =============================================================

const prisma = require("../config/database");

/** Base filter to exclude soft-deleted rows */
const notDeleted = { deletedAt: null };

/**
 * Get all active projects belonging to a user.
 */
const findAllByUser = (userId) => {
  return prisma.project.findMany({
    where: { userId, ...notDeleted },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      // Include task count so the UI can show it without a second request
      _count: { select: { tasks: { where: notDeleted } } },
    },
  });
};

/**
 * Find a single project by id, regardless of owner.
 * Used for ownership verification before allowing mutations.
 */
const findById = (id) => {
  return prisma.project.findFirst({
    where: { id, ...notDeleted },
  });
};

/**
 * Find a project only if it belongs to the specified user.
 * Used to safely fetch project data for a response.
 */
const findByIdAndUser = (id, userId) => {
  return prisma.project.findFirst({
    where: { id, userId, ...notDeleted },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { tasks: { where: notDeleted } } },
    },
  });
};

/**
 * Create a new project.
 */
const create = ({ userId, name, description }) => {
  return prisma.project.create({
    data: { userId, name, description },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Update mutable fields on a project.
 */
const update = (id, { name, description }) => {
  return prisma.project.update({
    where: { id },
    data: { name, description },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Soft-delete a project by setting deletedAt timestamp.
 * Tasks are cascade-deleted at the DB level via Prisma relation.
 */
const softDelete = (id) => {
  return prisma.project.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

module.exports = {
  findAllByUser,
  findById,
  findByIdAndUser,
  create,
  update,
  softDelete,
};
