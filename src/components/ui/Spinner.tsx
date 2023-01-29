import { getStyle } from "@lib/utils";
import React from "react";

const style = getStyle({
  defaultStyle: "border-t-4 border-4 border-gray-400 rounded-full animate-spin",
  variants: {
    width: {
      sm: "w-6 h-6",
      md: "w-10 h-10",
    },
    intent: {
      primary: "border-t-gray-700",
      secondary: "border-t-red-400",
    },
  },
  defaultVariants: {
    width: "sm",
    intent: "primary",
  },
});

export default function Spinner({ variants = null }) {
  return <div className={style(variants)} />;
}
