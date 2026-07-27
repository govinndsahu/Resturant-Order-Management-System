import { useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { userLoginApi } from "../../apis/userApis";
import { getAppRoute } from "../../utils/util";
import { useConfig } from "../../contexts/ConfigContext";

const Login = ({ appName }) => {
  const { backendUrl, user } = useConfig();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const formRef = useRef();

  const navigate = useNavigate();
  const route = (path = "") => getAppRoute(appName, path);

  const handleLoginUser = async () => {
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData(formRef.current);
      const { data } = await userLoginApi(formData, backendUrl);

      if (data?.success) {
        navigate(route());
      }
    } catch (error) {
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLoginUser();
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <i className="ri-restaurant-2-line"></i>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to manage your restaurant</p>
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
            <label htmlFor="username">
              <i className="ri-user-3-line"></i>
              Username
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
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
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
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
          </div>

          <button
            type="button"
            className={`login-submit ${isLoading ? "loading" : ""}`}
            onClick={handleLoginUser}
            disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <i className="ri-arrow-right-line"></i>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        {user ? (
          user?.role === 2 ? (
            <div className="login-footer">
              <span>Don't have an account?</span>
              <Link to={route("registerpage")}>Create account</Link>
            </div>
          ) : null
        ) : null}
      </div>
    </div>
  );
};

export default Login;
