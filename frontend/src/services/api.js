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
// Unwrap the data envelope and handle 401 globally

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Avoid importing navigate here (circular deps) — use window
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
