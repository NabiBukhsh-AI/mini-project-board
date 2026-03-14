// =============================================================
// validate.js — Zod validation middleware factory
//
// Usage: router.post("/", validate(mySchema), handler)
//
// Zod errors are thrown and caught by the global errorHandler,
// which formats them into a clean { errors } response shape.
// =============================================================

/**
 * Returns Express middleware that validates req.body against
 * the provided Zod schema. Throws on validation failure so
 * the centralized errorHandler formats the response.
 *
 * @param {import('zod').ZodSchema} schema
 */
const validate = (schema) => (req, res, next) => {
  try {
    // parse() throws ZodError on failure — caught by errorHandler
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { validate };
