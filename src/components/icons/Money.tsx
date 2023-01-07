import React from "react";

type Props = {
  [key: string]: string;
};

export const Money: React.FC<Props> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
      {...props}
    >
      <use href="/sprite.svg#money" />
    </svg>
  );
};
