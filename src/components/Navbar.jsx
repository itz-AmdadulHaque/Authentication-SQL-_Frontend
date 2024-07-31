import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Spinner from "./Spinner";

function Navbar() {
  const { auth, setAuth } = useAuth();
  const [loading, setLoading] = useState(false)
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      setLoading(true)
      const response = await axiosPrivate.get("/users/logout");
      // console.log(response);

      setAuth({});
      setLoading(false)
      navigate("/login");
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  return (
    <nav className="bg-gray-400 fixed w-full">
      <ul className="flex justify-center py-2 px-4  gap-6 text-xl font-semibold">
        {!auth?.user ? (
          <>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-blue-500" : "hover:text-blue-500"
                }
                to={"/"}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-blue-500" : "hover:text-blue-500"
                }
                to={"/login"}
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-blue-500" : "hover:text-blue-500"
                }
                to={"/signup"}
              >
                Signup
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>{`Welcome, ${auth?.user?.name}`}</li>
            <li>
              <button
                className={`border-l-2 border-black pl-2 ${loading ? "text-blue-700" : "hover:text-blue-500 "}`}
                onClick={handleClick}
                disabled={loading}
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
