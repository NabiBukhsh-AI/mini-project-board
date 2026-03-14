// =============================================================
// types/index.js — Shared JSDoc typedefs used across the app.
// JSDoc types give editors autocomplete without TypeScript.
// =============================================================

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} name
 * @property {string|null} description
 * @property {string} createdAt
 * @property {{ tasks: number }} _count
 */

/**
 * @typedef {'todo'|'in_progress'|'done'} TaskStatus
 * @typedef {'low'|'medium'|'high'} TaskPriority
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} projectId
 * @property {string} title
 * @property {string|null} description
 * @property {TaskStatus} status
 * @property {TaskPriority} priority
 * @property {string|null} dueDate
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} message
 * @property {*} data
 */

export {};
