import React from "react";

export default function Circle(props) {
  return (
    <svg width="60" height="60">
      <circle
        stroke="currentColor"
        strokeWidth="2"
        fill="transparent"
        r="28"
        cx="30"
        cy="30"
      ></circle>
      <circle
        className="text-primary"
        stroke="currentColor"
        strokeWidth="2"
        fill="transparent"
        r="28"
        cx="30"
        cy="30"
        style={{
          strokeDasharray: "175.929, 175.929",
          transform: "rotate(-90deg)",
          transformOrigin: "30px 30px",
        }}
        transform-origin="30px 30px"
        strokeDashoffset="175.92918860102841"
        {...props}
      ></circle>
    </svg>
  );
}
