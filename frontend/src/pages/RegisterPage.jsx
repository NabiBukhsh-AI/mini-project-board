// =============================================================
// RegisterPage.jsx
// =============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as authService from "../services/auth.service";
import "./AuthPage.css";

/**
 * Extracts field-level errors from an Axios error response.
 * Backend returns: { errors: { email: ["msg"], name: ["msg"] } }
 * Falls back to a single top-level message if no field errors exist.
 */
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

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const pw = fields.password;
  const rules = [
    { label: "At least 8 characters",         met: pw.length >= 8 },
    { label: "One uppercase letter (A–Z)",     met: /[A-Z]/.test(pw) },
    { label: "One number (0–9)",               met: /[0-9]/.test(pw) },
    { label: "One special character (!@#...)", met: /[^A-Za-z0-9]/.test(pw) },
  ];
  const allRulesMet = rules.every((r) => r.met);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrors({});
      const { user, token } = await authService.register(fields);
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
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {errors._banner && (
            <div className="form-error form-error--banner">
              <span>⚠️</span> {errors._banner}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className={`form-input ${errors.name ? "form-input--error" : ""}`}
              value={fields.name}
              onChange={set("name")}
              placeholder="Jane Smith"
              autoComplete="name"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

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
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
            {pw.length > 0 && (
              <ul className="password-rules">
                {rules.map((rule) => (
                  <li key={rule.label} className={rule.met ? "rule--met" : "rule--unmet"}>
                    {rule.met ? "✓" : "✗"} {rule.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={loading || !allRulesMet}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;