import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center h-screen">
      {user ? (
        user.role === "employer" ? (
          <Link
            to="/post-job"
            className="bg-blue-600 text-white px-6 py-3 text-lg font-semibold hover:bg-blue-800 shadow-lg"
          >
            Post a Job
          </Link>
        ) : (
          <Link
            to="/jobs"
            className="bg-green-600 text-white px-6 py-3 text-lg font-semibold hover:bg-green-800 shadow-lg"
          >
            Find a Job
          </Link>
        )
      ) : (
        <p className="text-white text-lg text-center">
            Please{" "}
            <Link
                to="/login"
                className="inline-block bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-800 transition-colors"
            >
                Login
            </Link>{" "}
            to continue.
            </p>

                )}
    </div>
  );
};

export default Home;
