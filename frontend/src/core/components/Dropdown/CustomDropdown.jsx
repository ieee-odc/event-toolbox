import React, { useState, useRef, useEffect } from "react";

const CustomDropdown = ({ children, toggleContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (e) => {
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="dropdown">
      <button
        className="btn dropdown-toggle hide-arrow text-body p-0"
        onClick={handleToggle}
      >
        {toggleContent}
      </button>
      {isOpen && (
        <div className="dropdown-menu show" onClick={handleItemClick}>
          {children}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
