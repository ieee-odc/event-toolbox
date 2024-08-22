import React, { useState, useRef, useEffect } from 'react';
import { createPopper } from '@popperjs/core';

const Dropdown = ({ toggleContent, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleItemClick = () => {
    // Handle item click logic here
    setIsOpen(false); // Optionally close the dropdown after an item click
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      createPopper(buttonRef.current, dropdownRef.current, {
        placement: 'bottom-end',
      });
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="dropdown pb-1">
      <button
        ref={buttonRef}
        className="btn dropdown-toggle hide-arrow text-body p-0"
        onClick={handleToggle}
      >
        {toggleContent}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="dropdown-menu dropdown-menu-end mt-2 show"
          aria-labelledby="emailsActions"
          onClick={handleItemClick}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
