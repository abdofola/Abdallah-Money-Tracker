import { getStyle } from "@lib/utils";
import React from "react";

const style = getStyle({
  defaultStyle: "border-gray-400 rounded-full animate-spin",
  variants: {
    width: {
      xs: "w-5 h-5 border-2",
      sm: "w-6 h-6 border-4",
      md: "w-10 h-10 border-4",
      lg: "w-16 h-16 border-4",
    },
    intent: {
      primary: "border-t-gray-700",
      secondary: "border-t-white",
    },
    margin: {
      0: "m-0",
      2: "m-2",
      4: "m-4",
    },
  },
  defaultVariants: {
    width: "sm",
    intent: "primary",
    margin: '0',
  },
});

export default function Spinner({ variants = null, className }) {
  return (
    <div className={style(variants).concat(className ? " " + className : "")} />
  );
}
