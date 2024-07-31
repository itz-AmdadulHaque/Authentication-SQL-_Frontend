import { useEffect } from "react";
import { axiosPrivate } from "../api/axios.js";
import useRefreshToken from "./useRefreshToken.jsx";
import useAuth from "./useAuth.jsx";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    // interceptor is like middlewar of axios api, can modify req and res
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        // console.log("no access token")
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true; // adding 'sent' property

          // console.log("request for access token")
          const newAccessToken = await refresh();

          // console.log("new Access token: ", newAccessToken)
          
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axiosPrivate(prevRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
