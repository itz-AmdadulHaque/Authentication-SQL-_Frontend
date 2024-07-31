import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-300 h-screen text-center flex justify-center items-center">
      <div className="w-[90%] sm:w-[60%]">
        <h1 className="py-2 text-3xl font-semibold  text-purple-700">
          🔶🔷Welcome🔷🔶
        </h1>
        <p className="text-purple-800">
          You can create an account, if you don't have one. Here any register user can
          block or delete other user account.
        </p>
        <div className="mt-2 flex justify-center gap-2">
          <button>
            <Link
              className="py-1 px-2 font-semibold border-2 border-purple-600 text-purple-600 hover:bg-purple-200"
              to="/login"
            >
              Login
            </Link>
          </button>
          <button>
            <Link
              className="py-1 px-2 font-semibold border-2 border-purple-600 text-purple-600 hover:bg-purple-200"
              to="/signup"
            >
              Sign up
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
