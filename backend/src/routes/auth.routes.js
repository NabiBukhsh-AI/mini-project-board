const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/authenticate");
const { validate } = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

const router = Router();

// POST /auth/register
router.post("/register", validate(registerSchema), authController.register);

// POST /auth/login
router.post("/login", validate(loginSchema), authController.login);

// GET /auth/me  — protected: returns current user from token
router.get("/me", authenticate, authController.me);

module.exports = router;
