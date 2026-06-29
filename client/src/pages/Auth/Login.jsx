import { useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { userLoginApi } from "../../apis/userApis";
import { getAppRoute } from "../../utils/util";
import { useConfig } from "../../contexts/ConfigContext";

const Login = ({ appName }) => {
  const { backendUrl } = useConfig();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const formRef = useRef();

  const formData = new FormData(formRef.current);

  const navigate = useNavigate();
  const route = (path = "") => getAppRoute(appName, path);

  const handleLoginUser = async () => {
    try {
      const { data } = await userLoginApi(formData, backendUrl);

      if (data?.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate(route());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main id="user-auth">
      <div className="auth-container w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[600px]">
        <h1 className="text-2xl">User Login</h1>
        <form ref={formRef} id="login-form">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            required
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleLoginUser();
            }}>
            Login
          </button>
        </form>
        {localStorage.getItem("user") ? (
          JSON.parse(localStorage.getItem("user"))?.role === 2 ? (
            <Link id="bottom-link" to={route("registerpage")} className="">
              Don't have an account? <span>Register account.</span>
            </Link>
          ) : (
            <span></span>
          )
        ) : (
          <span></span>
        )}
      </div>
    </main>
  );
};

export default Login;
