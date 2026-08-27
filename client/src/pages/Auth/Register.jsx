import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { userRegisterApi } from "../../apis/userApis";
import { getAppRoute } from "../../utils/util";
import { useConfig } from "../../contexts/ConfigContext";

const Register = ({ appName }) => {
  const { backendUrl } = useConfig();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const route = (path = "") => getAppRoute(appName, path);

  const formRef = useRef();

  const handleRegisterUser = async () => {
    setError("");

    if (!name.trim() || !username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData(formRef.current);
      const { data } = await userRegisterApi(formData, backendUrl);

      if (data.success) {
        navigate(route());
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleRegisterUser();
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <i className="ri-user-add-line"></i>
          </div>
          <h1>Create Account</h1>
          <p>Join us to manage your restaurant</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="login-error">
            <i className="ri-error-warning-line"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form ref={formRef} className="login-form" onKeyDown={handleKeyDown}>
          <div className="form-field">
            <label htmlFor="name">
              <i className="ri-user-smile-line"></i>
              Full Name
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="username">
              <i className="ri-user-3-line"></i>
              Username
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.trim());
                  setError("");
                }}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password">
              <i className="ri-lock-password-line"></i>
              Password
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Create a password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value.trim());
                  setError("");
                }}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}>
                <i
                  className={
                    showPassword ? "ri-eye-off-line" : "ri-eye-line"
                  }></i>
              </button>
            </div>
            <span className="password-hint">Must be at least 6 characters</span>
          </div>

          <button
            type="button"
            className={`login-submit ${isLoading ? "loading" : ""}`}
            onClick={handleRegisterUser}
            disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <i className="ri-arrow-right-line"></i>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <span>Already have an account?</span>
          <Link to={route("loginpage")}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
