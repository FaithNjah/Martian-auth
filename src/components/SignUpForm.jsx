import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebook, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import "../styles/signUpForm.css";

// --------------------------
// Validation helpers
// --------------------------
// Pure functions to handle field validation. Keeps validation logic separate
// from UI and allows for easier testing and reuse.
function validateName(name) {
  if (!name) return "Full name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  return "";
}

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
// Simulates backend response. In production, this would call a real API.
async function signUpUser(name, email, password) {
  await new Promise((r) => setTimeout(r, 1000));

  if (email === "taken@test.com") {
    throw new Error("Email already exists");
  }
  if (email === "error@test.com") {
    throw new Error("Network error, try later");
  }

  return { success: true, user: { name, email } };
}

const SignUpForm = () => {
  // --------------------------
  // Component state
  // --------------------------
  const [formData, setFormData] = useState({ name: "", email: "", password: "", terms: false });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --------------------------
  // Field-level blur validation
  // --------------------------
  const handleBlur = (field) => {
    let message = "";
    if (field === "name") message = validateName(formData.name);
    if (field === "email") message = validateEmail(formData.email);
    if (field === "password") message = validatePassword(formData.password);

    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  // --------------------------
  // Generic input change handler
  // --------------------------
  // Updates form data and clears error for the field if any.
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
    if (isSubmitting) return;

    // Validate all fields before submission
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const termsError = !formData.terms ? "You must agree to the Terms & Conditions" : "";

    if (nameError || emailError || passwordError || termsError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        terms: termsError,
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Attempt signup
      await signUpUser(formData.name, formData.email, formData.password);
      setIsSuccess(true);
    } catch (err) {
      // Handle API-level or network errors
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
            <h2>Welcome to Martians Spa! </h2>
            <Link to="/login" className="submit-button">
              Sign In Now
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // --------------------------
  // Main signup form
  // --------------------------
  return (
    <div className="login-page">
      <main className="login-right" aria-label="Authentication section">
        {/* Header */}
        <header className="form-header">
          <h1 className="brand-title">Auth</h1>
        </header>

        {/* Navigation between auth routes */}
        <nav className="form-nav" aria-label="Authentication navigation">
          <Link to="/login" className="nav-link">
            Sign In
          </Link>
          <Link to="/signup" className="nav-link active" aria-current="page">
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

          {/* Name field */}
          <div className={`form-group ${errors.name ? "error" : ""}`}>
            <label htmlFor="full-name">Full Name</label>
            <input
              id="full-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              autoComplete="name"
              aria-invalid={!!errors.name}
              required
              disabled={isSubmitting}
            />
            {errors.name && <span className="error-text" role="alert">{errors.name}</span>}
          </div>

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
              aria-invalid={!!errors.email}
              required
              disabled={isSubmitting}
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
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              required
              disabled={isSubmitting}
            />
            {errors.password && <span className="error-text" role="alert">{errors.password}</span>}
          </div>

          {/* Terms and conditions */}
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={(e) => handleChange("terms", e.target.checked)}
                disabled={isSubmitting}
                required
                aria-invalid={!!errors.terms}
              />
              I agree to the Terms & Conditions
            </label>
            {errors.terms && <span className="error-text" role="alert">{errors.terms}</span>}
          </div>

          {/* Submit button */}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer social links */}
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

export default SignUpForm;
