import React from "react";

export default function Circle(props) {
  return (
    <svg width="60" height="60" className="text-gray-300">
      <circle
        stroke="currentColor"
        strokeWidth="2"
        fill="transparent"
        r="28"
        cx="30"
        cy="30"
      />
      <circle
        stroke="currentColor"
        strokeWidth="2"
        fill="transparent"
        r="28"
        cx="30"
        cy="30"
        {...props}
      />
    </svg>
  );
}
