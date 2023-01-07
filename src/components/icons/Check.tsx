import React from "react";

const Check: React.FC<any> = ({ ...props }) => {
  return (
    <svg className="h-5 w-5" {...props}>
      <use href="/sprite.svg#check" />
    </svg>
  );
};

export default Check;
