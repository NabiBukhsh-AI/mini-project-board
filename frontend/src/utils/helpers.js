// =============================================================
// helpers.js — Shared utility functions
// =============================================================

/**
 * Extract a user-friendly error message from an Axios error.
 * Falls back through the response body, then the JS error message.
 * @param {Error} err
 * @returns {string}
 */
export const getErrorMessage = (err) => {
  return (
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong. Please try again."
  );
};

/**
 * Format an ISO date string to a readable date.
 * Returns "—" when no date is provided.
 * @param {string|null} dateStr
 * @returns {string}
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Convert a snake_case or underscore string to Title Case for display.
 * e.g. "in_progress" → "In Progress"
 * @param {string} str
 * @returns {string}
 */
export const toDisplayLabel = (str) => {
  if (!str) return "";
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Returns true if a task's due date is in the past.
 * @param {string|null} dueDate
 * @returns {boolean}
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

/** Maps task status values to CSS class suffixes */
export const STATUS_COLORS = {
  todo: "gray",
  in_progress: "blue",
  done: "green",
};

/** Maps task priority values to CSS class suffixes */
export const PRIORITY_COLORS = {
  low: "green",
  medium: "yellow",
  high: "red",
};
