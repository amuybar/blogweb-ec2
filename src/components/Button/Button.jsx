
import React from "react";

const Button = ({ onClick, isActive, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded ${
        isActive ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
