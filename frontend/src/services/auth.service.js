// =============================================================
// auth.service.js — Auth API calls
//
// Separating API calls from components means:
//  - Components only call service functions, never axios directly
//  - If the API changes, only the service needs updating
// =============================================================

import api from "./api";

/**
 * @param {{ name: string, email: string, password: string }} data
 * @returns {Promise<{ user, token }>}
 */
export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data.data;
};

/**
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ user, token }>}
 */
export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data.data;
};
