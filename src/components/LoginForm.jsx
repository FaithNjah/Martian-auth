import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebook, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import "../styles/loginForm.css";

// --------------------------
// Validation helpers
// --------------------------
// Pure validation functions for email/password fields.
// Keeps UI separate from business logic and allows reuse.
function validateEmail(email) {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
  return "";
}

function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 6) return "At least 6 characters required";
  return "";
}

// --------------------------
// Mock API simulation
// --------------------------
// Simulates server-side login with basic error handling.
// In production, replace with a real `fetch` or API call.
async function loginUser(email, password) {
  await new Promise((r) => setTimeout(r, 1000)); // simulate latency

  if (email === "error@test.com") {
    throw new Error("Network error, try again later.");
  }

  if (email === "demo@test.com" && password === "password") {
    return { success: true, user: { email } };
  }

  throw new Error("Invalid email or password");
}

// --------------------------
// Login Form Component
// --------------------------
const LoginForm = () => {
  // --------------------------
  // Component state
  // --------------------------
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --------------------------
  // Field-level validation
  // --------------------------
  const handleBlur = (field) => {
    let message = "";
    if (field === "email") message = validateEmail(formData.email);
    if (field === "password") message = validatePassword(formData.password);

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  // Clears error as user types if fixed
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // --------------------------
  // Form submission
  // --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // prevents double submit

    // Validate before sending request
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Attempt login
      await loginUser(formData.email, formData.password);
      setIsSuccess(true);
    } catch (err) {
      // Handles both API errors and network issues
      setErrors({ general: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------
  // Success state rendering
  // --------------------------
  if (isSuccess) {
    return (
      <div className="login-page">
        <main className="login-right" aria-live="polite">
          <div className="success-state">
            <h2>Welcome back!</h2>
            <p>You have successfully signed in to Martians Spa.</p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({ email: "", password: "" });
              }}
              className="submit-button"
            >
              Sign In Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  // --------------------------
  // Main login form
  // --------------------------
  return (
    <div className="login-page">
      <main className="login-right" aria-label="Authentication section">
        {/* Brand header */}
        <header className="form-header">
          <h1 className="brand-title">Auth</h1>
        </header>

        {/* Navigation between Sign In / Sign Up */}
        <nav className="form-nav" aria-label="Authentication navigation">
          <Link to="/login" className="nav-link active" aria-current="page">
            Sign In
          </Link>
          <Link to="/signup" className="nav-link">
            Sign Up
          </Link>
        </nav>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* General errors */}
          {errors.general && (
            <div className="error-message" role="alert" aria-live="polite">
              {errors.general}
            </div>
          )}

          {/* Email field */}
          <div className={`form-group ${errors.email ? "error" : ""}`}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              autoComplete="email"
              required
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
            />
            {errors.email && <span className="error-text" role="alert">{errors.email}</span>}
          </div>

          {/* Password field */}
          <div className={`form-group ${errors.password ? "error" : ""}`}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              autoComplete="current-password"
              required
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
            />
            {errors.password && <span className="error-text" role="alert">{errors.password}</span>}
          </div>

          {/* Options: remember me & forgot password */}
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" name="remember" disabled={isSubmitting} /> Remember me
            </label>
            <a className="forgot-link" href="/forgot-password">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Social media footer */}
        <footer className="form-footer">
          <nav className="social-nav" aria-label="Social media">
            <a href="https://twitter.com" aria-label="Twitter">
              <FontAwesomeIcon icon={faTwitter} aria-hidden="true" />
            </a>
            <a href="https://facebook.com" aria-label="Facebook">
              <FontAwesomeIcon icon={faFacebook} aria-hidden="true" />
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} aria-hidden="true" />
            </a>
            <a href="https://youtube.com" aria-label="YouTube">
              <FontAwesomeIcon icon={faYoutube} aria-hidden="true" />
            </a>
          </nav>
        </footer>
      </main>
    </div>
  );
};

export default LoginForm;
