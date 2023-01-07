import React from "react";

export default function Plus({ ...props }) {
  return (
    <svg
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <use href="/sprite.svg#plus" />
    </svg>
  );
}
