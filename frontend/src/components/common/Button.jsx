import React from "react";

const Button = ({ onClick, children, className = "", disabled = false }) => {
  return (
    <button
      onClick={onClick}
      className={`mt-4 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-800 ml-4 cursor-pointer ${
        disabled ? "bg-gray-400 cursor-not-allowed" : ""
      } ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
