import React, { useState, useRef, useEffect } from "react";

const ExpandableInput = ({ 
  placeholder, 
  onValueChange, 
  type = "text",
  className = "",
  multiline = false,
  maxLength,
  rows = 1,
}) => {
  const [value, setValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);

  // Dynamic input/textarea based on multiline prop
  const InputComponent = multiline ? "textarea" : "input";

  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    // Optional max length validation
    if (maxLength && inputValue.length > maxLength) {
      return;
    }

    setValue(inputValue);
    
    // Optional callback for parent component
    if (onValueChange) {
      onValueChange(inputValue);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    if (value.trim() === "") {
      setIsExpanded(false);
    }
  };

  // Auto-resize functionality for textarea
  useEffect(() => {
    if (multiline && inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [value, multiline]);

  return (
    <div className="relative w-full">
      <InputComponent
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        rows={multiline ? rows : 1}
        maxLength={maxLength}
        className={`
          w-full 
          p-2 
          border 
          rounded 
          transition-all 
          duration-300 
          resize-none 
          outline-none 
          focus:ring-2 
          focus:ring-blue-300
          ${isExpanded ? "h-auto" : "h-10"}
          ${className}
        `}
      />
      {value.length > 0 && isExpanded && (
        <div className="text-xs text-gray-500 absolute right-2 bottom-[-20px]">
          {maxLength ? `${value.length}/${maxLength}` : null}
        </div>
      )}
    </div>
  );
};

export default ExpandableInput;