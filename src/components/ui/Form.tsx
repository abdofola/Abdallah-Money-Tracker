import React from "react";
import { getStyle } from "@lib/utils";

type Variants = ["gutter", "layout", "padding", "margin", "width"];

const style = getStyle<Variants>({
  defaultStyle: "mx-auto bg-white border border-gray-100 rounded-lg",
  variants: {
    layout: {
      vertical: "flex flex-col",
      horizental: "flex items-center gap-2",
    },
    gutter: {
      0: "gap-0",
      2: "gap-2",
      4: "gap-4",
    },
    padding: {
      0: "p-0",
      2: "p-2",
      4: "p-4",
    },
    margin: {
      0: "m-0",
      "t-4": "mt-4",
    },
    width: {
      sm: "max-w-sm w-full",
      md: "max-w-md w-full",
      lg: "max-w-lg w-full",
      full: "w-full",
    },
  },
  defaultVariants: {
    layout: "vertical",
    padding: "2",
    margin: "t-4",
    width: "full",
    gutter: "4",
  },
});

export default function Form({
  children,
  className,
  onSubmit,
  variants = null,
  ...props
}) {
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    onSubmit(Object.fromEntries(formData), formData.getAll.bind(formData));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={style(variants).concat(className ? " " + className : "")}
      {...props}
    >
      {children}
    </form>
  );
}
