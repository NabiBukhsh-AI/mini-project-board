// =============================================================
// response.js — Standardized API response helpers
//
// Every response follows the same envelope:
//   { success, message, data }   — success
//   { success, message, errors } — failure
//
// Using helpers prevents one-off response shapes from
// sneaking in as the codebase grows.
// =============================================================

/**
 * Send a successful response.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {string} message
 * @param {number} statusCode
 */
const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send a 201 Created response.
 */
const sendCreated = (res, data, message = "Created successfully") => {
  return sendSuccess(res, data, message, 201);
};

/**
 * Send a paginated list response.
 * Includes meta object with pagination details.
 */
const sendPaginated = (res, data, total, page, limit, message = "Success") => {
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

module.exports = { sendSuccess, sendCreated, sendPaginated };
