
import React from "react";

const Button = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 bg-gray-200 rounded hover:bg-gray-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
