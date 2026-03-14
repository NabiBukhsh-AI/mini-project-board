// =============================================================
// project.controller.js
// =============================================================

const projectService = require("../services/project.service");
const { sendSuccess, sendCreated } = require("../utils/response");

/** GET /projects */
const getAll = async (req, res, next) => {
  try {
    const projects = await projectService.getAll(req.user.id);
    return sendSuccess(res, projects);
  } catch (err) {
    next(err);
  }
};

/** GET /projects/:id */
const getOne = async (req, res, next) => {
  try {
    const project = await projectService.getOne(req.params.id, req.user.id);
    return sendSuccess(res, project);
  } catch (err) {
    next(err);
  }
};

/** POST /projects */
const create = async (req, res, next) => {
  try {
    const project = await projectService.create({
      userId: req.user.id,
      ...req.body,
    });
    return sendCreated(res, project, "Project created successfully");
  } catch (err) {
    next(err);
  }
};

/** PATCH /projects/:id */
const update = async (req, res, next) => {
  try {
    const project = await projectService.update(
      req.params.id,
      req.user.id,
      req.body
    );
    return sendSuccess(res, project, "Project updated successfully");
  } catch (err) {
    next(err);
  }
};

/** DELETE /projects/:id */
const remove = async (req, res, next) => {
  try {
    await projectService.remove(req.params.id, req.user.id);
    return sendSuccess(res, null, "Project deleted successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };
