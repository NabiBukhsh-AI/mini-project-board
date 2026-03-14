const { Router } = require("express");
const taskController = require("../controllers/task.controller");
const { authenticate } = require("../middleware/authenticate");
const { validate } = require("../middleware/validate");
const { createTaskSchema, updateTaskSchema } = require("../validators/task.validator");

// mergeParams: true lets us access :projectId from the parent router
const router = Router({ mergeParams: true });

router.use(authenticate);

// GET  /projects/:projectId/tasks?status=todo&sortBy=dueDate&sortOrder=asc
router.get("/", taskController.getAll);

// POST /projects/:projectId/tasks
router.post("/", validate(createTaskSchema), taskController.create);

// PATCH /tasks/:id  — projectId must be in the request body
router.patch("/:id", validate(updateTaskSchema), taskController.update);

// DELETE /tasks/:id — projectId must be in the request body
router.delete("/:id", taskController.remove);

module.exports = router;
