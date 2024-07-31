import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const RequireAuth = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const [loading, setLoading] = useState();

  const getUser = async () => {
    try {
      setLoading(true);
      const { data } = await axiosPrivate.get("/users/");
      // console.log("Requre auth: ", data);

      setAuth((prev) => {
        return { ...prev, user: data?.data?.user };
      });
    } catch (error) {
      console.log("//Error: ", error);
      setAuth({});
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth?.accessToken) {
      getUser();
    }
  }, []);

  // console.log("requre Auth: ",auth)
  return loading || !auth?.accessToken ? (
    <div className="h-screen">
      <Spinner />
    </div>
  ) : (
    <Outlet />
  );
};

export default RequireAuth;
