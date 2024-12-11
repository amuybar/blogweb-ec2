import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ToolbarButton = ({ 
    onClick, 
    isActive, 
    icon, 
    className = '', 
    tooltipText 
  }) => {
    return (
      <button
        onClick={onClick}
        className={`
          group relative p-2 rounded-md transition-all duration-200
          ${isActive 
            ? 'bg-blue-500 text-white' 
            : 'hover:bg-gray-200 text-gray-700'}
          focus:outline-none focus:ring-2 focus:ring-blue-300
          ${className}
        `}
        aria-pressed={isActive}
        title={tooltipText}
      >
        <FontAwesomeIcon icon={icon} />
      </button>
    );
  };

  export default ToolbarButton;