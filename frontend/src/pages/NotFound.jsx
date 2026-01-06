import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-gray-100 rounded-lg shadow-md p-12 text-center">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-gray-800">404</h1>
        </div>

        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          The page you are looking for does not exist.
        </p>

        <div className="flex justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;