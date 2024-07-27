import React, { useState } from "react";
import "./Button.css";

const CustomButton = ({
  text,
  iconClass,
  backgroundColor,
  textColor,
  hoverBackgroundColor,
  hoverTextColor,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      className="custom-button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? hoverBackgroundColor : backgroundColor,
        color: isHovered ? hoverTextColor : textColor,
      }}
    >
      {iconClass && <i className={`${iconClass}`}></i>}
      <p className="mx-1">{text}</p>
    </button>
  );
};

export default CustomButton;
