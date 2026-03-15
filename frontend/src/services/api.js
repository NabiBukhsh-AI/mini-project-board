// =============================================================
// api.js — Axios instance with request/response interceptors
//
// Centralising the Axios configuration means:
//  - Every request automatically gets the Authorization header
//  - 401 responses automatically clear auth state and redirect
//  - Base URL is set in one place
// =============================================================

import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ── Request interceptor ──────────────────────────────────────
// Attach the stored JWT to every outgoing request

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────────
// Only trigger the logout/redirect flow when a stored token is
// rejected (expired session). A 401 on /auth/login or /auth/register
// is a normal failed attempt — let it propagate to the catch block.

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Token expired or revoked — clear session and send to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;