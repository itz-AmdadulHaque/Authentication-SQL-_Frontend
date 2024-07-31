import React, { useState } from "react";
import axios from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState({ email: "", password: "" });
  const [errMsg, setErrMsg] = useState({ success: false, message: "" });
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg({ success: false, message: "" });

    if (!emailRegex.test(user?.email) || !user?.password) {
      setErrMsg({ message: "Invalid Entry" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/users/login", user, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      // console.log(response);

      setAuth(response?.data?.data);

      setErrMsg({
        success: response?.data?.success,
        message: response?.data?.message,
      });
      setUser({ name: "", email: "", password: "" });
      setLoading(false);
      navigate("/users", { replace: true });
    } catch (error) {
      console.log(error);
      if (!error?.response) {
        setErrMsg({ message: "No Server Response or Network error" });
      }
      setErrMsg({ message: error?.response?.data?.message });
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setUser((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] sm:w-[350px] flex flex-col gap-2 bg-gray-400 p-4 rounded-md"
      >
        <h1 className="font-semibold text-2xl text-center pb-2 border-b-2">
          Login
        </h1>
        {errMsg.message && (
          <p
            className={`font-semibold text-xl text-center ${
              errMsg.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {errMsg?.message}
          </p>
        )}

        <input
          className="bg-gray-300 p-1 rounded-md"
          type="email"
          value={user.email}
          name="email"
          onChange={handleChange}
          placeholder="Your Email"
        />

        <input
          className="bg-gray-300 p-1 rounded-md"
          type="password"
          value={user.password}
          name="password"
          onChange={handleChange}
          placeholder="Your Password"
        />

        <button
          type="submit"
          className="bg-gray-500 font-semibold rounded-md p-[1px] border-2 border-gray-700 hover:bg-gray-600"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        <Link
          to={"/signup"}
          className="text-blue-700 hover:text-blue-900 underline text-center"
        >
          Don't Have an account?
        </Link>
      </form>
    </div>
  );
};

export default Login;
