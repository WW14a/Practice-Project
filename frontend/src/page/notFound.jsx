import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex  min-h-screen bg-gray-950  flex-col items-center justify-center text-center">
      <h1 className="text-7xl font-bold text-white">404</h1>

      <h2 className="mt-4 text-2xl font-semibold text-gray-200">
        Page Not Found
      </h2>

      <p className="mt-2 text-gray-400">
        Sorry, the page you are looking for doesn't exist.
      </p>

      <Link
        to="/dashboard"
        className="mt-6 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-200"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
