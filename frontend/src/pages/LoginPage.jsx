// =============================================================
// LoginPage.jsx
// =============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as authService from "../services/auth.service";
import "./AuthPage.css";

const extractErrors = (err) => {
  const fieldErrors = err?.response?.data?.errors;
  if (fieldErrors && typeof fieldErrors === "object") {
    return Object.fromEntries(
      Object.entries(fieldErrors).map(([key, msgs]) => [key, msgs[0]])
    );
  }
  return {
    _banner:
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong. Please try again.",
  };
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrors({});
      const { user, token } = await authService.login(fields);
      login(user, token);
      navigate("/projects");
    } catch (err) {
      setErrors(extractErrors(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1>📋 Mini Project Board</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* General banner — wrong password, account not found, etc. */}
          {errors._banner && (
            <div className="form-error form-error--banner">
              <span>⚠️</span> {errors._banner}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              className={`form-input ${errors.email ? "form-input--error" : ""}`}
              value={fields.email}
              onChange={set("email")}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={`form-input ${errors.password ? "form-input--error" : ""}`}
              value={fields.password}
              onChange={set("password")}
              placeholder="Your password"
              autoComplete="current-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-card__footer">
          Don't have an account?{" "}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;