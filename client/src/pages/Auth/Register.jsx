import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const formRef = useRef();

  const formData = new FormData(formRef.current);

  const handleRegisterUser = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URI}/users/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      console.log(data);
      if (data.success) {
        navigate("/");
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar name={"Logo name"} />
      <main id="user-auth">
        <div className="auth-container w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[800px] ">
          <h1 className="text-2xl">User Registration</h1>
          <form ref={formRef} id="registerForm" className="">
            <div>
              <label className="" htmlFor="name">
                Full Name
              </label>
              <input
                // className="xl:text-3xl text-3xl"
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
              <label className="" htmlFor="phone">
                Phone Number
              </label>
              <input
                // className="xl:text-3xl text-3xl"
                value={phone}
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                required
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="" htmlFor="password">
                Password
              </label>
              <input
                // className="xl:text-3xl text-3xl"
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
          <Link to="/loginpage" id="bottom-link" className="">
            Already have an account? <span>Login account.</span>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Register;
