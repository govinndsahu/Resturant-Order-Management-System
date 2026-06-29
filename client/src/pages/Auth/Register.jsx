import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../../components/Navbar";
import { userRegisterApi } from "../../apis/userApis";
import { getAppRoute } from "../../utils/util";
import { useConfig } from "../../contexts/ConfigContext";

const Register = ({ appName }) => {
  const { backendUrl } = useConfig();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const route = (path = "") => getAppRoute(appName, path);

  const formRef = useRef();

  const formData = new FormData(formRef.current);

  const handleRegisterUser = async () => {
    try {
      const { data } = await userRegisterApi(formData, backendUrl);

      if (data.success) {
        navigate(route());
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar name={appName} appName={appName} />
      <main id="user-auth">
        <div className="auth-container w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[800px]">
          <h1 className="text-2xl">User Registration</h1>
          <form ref={formRef} id="registerForm" className="">
            <div>
              <label className="" htmlFor="name">
                Full Name
              </label>
              <input
                value={name}
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                required
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="" htmlFor="username">
                Username
              </label>
              <input
                value={username}
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                required
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="" htmlFor="password">
                Password
              </label>
              <input
                value={password}
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <button
              className=""
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleRegisterUser();
              }}>
              Register
            </button>
          </form>{" "}
          <br />
          <Link to={route("loginpage")} id="bottom-link" className="">
            Already have an account? <span>Login account.</span>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Register;
