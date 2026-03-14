// =============================================================
// task.controller.js
// =============================================================

const taskService = require("../services/task.service");
const { sendSuccess, sendCreated } = require("../utils/response");

/** GET /projects/:projectId/tasks */
const getAll = async (req, res, next) => {
  try {
    const { status, sortBy, sortOrder } = req.query;

    const tasks = await taskService.getAll(
      req.params.projectId,
      req.user.id,
      { status, sortBy, sortOrder }
    );

    return sendSuccess(res, tasks);
  } catch (err) {
    next(err);
  }
};

/** POST /projects/:projectId/tasks */
const create = async (req, res, next) => {
  try {
    const task = await taskService.create(
      req.params.projectId,
      req.user.id,
      req.body
    );
    return sendCreated(res, task, "Task created successfully");
  } catch (err) {
    next(err);
  }
};

/** PATCH /tasks/:id */
const update = async (req, res, next) => {
  try {
    // projectId comes from body so the service can verify ownership
    const { projectId, ...updates } = req.body;

    const task = await taskService.update(
      req.params.id,
      projectId,
      req.user.id,
      updates
    );
    return sendSuccess(res, task, "Task updated successfully");
  } catch (err) {
    next(err);
  }
};

/** DELETE /tasks/:id */
const remove = async (req, res, next) => {
  try {
    const { projectId } = req.body;

    await taskService.remove(req.params.id, projectId, req.user.id);
    return sendSuccess(res, null, "Task deleted successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create, update, remove };
