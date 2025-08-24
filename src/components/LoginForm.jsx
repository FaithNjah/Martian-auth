import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faFacebook, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import "../styles/loginForm.css";

// ====================
// Validation helpers
// ====================

// Validate email format and presence
function validateEmail(email) {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
  return "";
}

// Validate password presence and minimum length
function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 6) return "At least 6 characters required";
  return "";
}

// ====================
// Mock login API
// ====================
// Simulates a login request with network error and demo credentials
async function loginUser(email, password) {
  await new Promise((r) => setTimeout(r, 1000)); // simulate network delay

  if (email === "error@test.com") {
    throw new Error("Network error, try again later.");
  }

  if (email === "demo@test.com" && password === "password") {
    return { success: true, user: { email } };
  }

  throw new Error("Invalid email or password");
}

// ====================
// Login Form Component
// ====================
const LoginForm = () => {
  // Form state
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --------------------
  // Input event handlers
  // --------------------
  const handleBlur = (field) => {
    let message = "";
    if (field === "email") message = validateEmail(formData.email);
    if (field === "password") message = validatePassword(formData.password);

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // Validate field on change and clear error if fixed
    let message = "";
    if (field === "email") message = validateEmail(value);
    if (field === "password") message = validatePassword(value);
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  // --------------------
  // Form submission
  // --------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // prevent double submits

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await loginUser(formData.email, formData.password);
      setIsSuccess(true);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ====================
  // Success state UI
  // ====================
  if (isSuccess) {
    return (
      <div className="login-page">
        <main className="login-right" aria-live="polite">
          <div className="success-state">
            <h2>Welcome back! 🎉</h2>
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

  // ====================
  // Login form UI
  // ====================
  return (
    <div className="login-page">
      <main className="login-right" aria-label="Authentication section">
        {/* Brand header */}
        <header className="form-header">
          <h1 className="brand-title">Martians Spa</h1>
          <span className="brand-mark" aria-hidden="true">
            <FontAwesomeIcon icon={faCircle} />
          </span>
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

        {/* Form fields */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div className="error-message" role="alert" aria-live="polite">
              {errors.general}
            </div>
          )}

          {/* Email input */}
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
            />
            {errors.email && <span className="error-text" role="alert">{errors.email}</span>}
          </div>

          {/* Password input */}
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
            />
            {errors.password && <span className="error-text" role="alert">{errors.password}</span>}
          </div>

          {/* Form options */}
          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" name="remember" disabled={isSubmitting} /> Remember me
            </label>
            <a className="forgot-link" href="/forgot-password">
              Forgot password?
            </a>
          </div>

          {/* Submit button */}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Social media links */}
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
