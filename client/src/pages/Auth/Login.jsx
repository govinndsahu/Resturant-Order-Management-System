import axios from "axios";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const formRef = useRef();

  const formData = new FormData(formRef.current);

  const navigate = useNavigate();

  const handleLoginUser = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URI}/users/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (data?.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
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
          <label htmlFor="phone">Phone Number</label>
          <input
            type="number"
            id="phone"
            name="phone"
            placeholder="Enter your phone number"
            required
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
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
            <Link id="bottom-link" to="/registerpage" className="">
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
