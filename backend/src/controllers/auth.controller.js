// =============================================================
// auth.controller.js
//
// Controllers are intentionally thin: parse request, call
// service, send response. Zero business logic lives here.
// =============================================================

const authService = require("../services/auth.service");
const { sendSuccess, sendCreated } = require("../utils/response");

/**
 * POST /auth/register
 */
const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    return sendCreated(res, { user, token }, "Account created successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * POST /auth/login
 */
const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    return sendSuccess(res, { user, token }, "Login successful");
  } catch (err) {
    next(err);
  }
};

/**
 * GET /auth/me  — returns the authenticated user from JWT
 * Useful for the frontend to rehydrate auth state on page load.
 */
const me = async (req, res, next) => {
  try {
    return sendSuccess(res, { user: req.user }, "Authenticated");
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };
