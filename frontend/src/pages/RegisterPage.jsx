// =============================================================
// RegisterPage.jsx
// =============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as authService from "../services/auth.service";
import { getErrorMessage } from "../utils/helpers";
import "./AuthPage.css";

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [fields, setFields] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const { user, token } = await authService.register(fields);
      login(user, token);
      navigate("/projects");
    } catch (err) {
      setError(getErrorMessage(err));
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
          {error && <p className="form-error">{error}</p>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={fields.name}
              onChange={set("name")}
              placeholder="Jane Smith"
              required
              autoComplete="name"
              minLength={2}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={fields.email}
              onChange={set("email")}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={fields.password}
              onChange={set("password")}
              placeholder="Min. 8 characters"
              required
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={loading}
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
