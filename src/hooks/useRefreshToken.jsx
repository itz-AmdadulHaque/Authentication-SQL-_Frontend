import axios from "../api/axios";
import useAuth from "./useAuth";


const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response  = await axios.get("/users/refresh", {
      withCredentials: true,
    });
    // console.log("useRerfresh: ", response)
    setAuth(prev => {
      return {...prev, accessToken: response?.data?.data?.accessToken}
    });

    return response?.data?.data?.accessToken;
  };

  return refresh; 
};

export default useRefreshToken;
