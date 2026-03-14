const { Router } = require("express");
const projectController = require("../controllers/project.controller");
const { authenticate } = require("../middleware/authenticate");
const { validate } = require("../middleware/validate");
const {
  createProjectSchema,
  updateProjectSchema,
} = require("../validators/project.validator");

const router = Router();

// All project routes require authentication
router.use(authenticate);

// GET  /projects
router.get("/", projectController.getAll);

// GET  /projects/:id
router.get("/:id", projectController.getOne);

// POST /projects
router.post("/", validate(createProjectSchema), projectController.create);

// PATCH /projects/:id
router.patch("/:id", validate(updateProjectSchema), projectController.update);

// DELETE /projects/:id
router.delete("/:id", projectController.remove);

module.exports = router;
