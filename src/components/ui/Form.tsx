import React from "react";
import { getStyle } from "@lib/utils";

type Variants = ["layout", "padding", "margin"];

const style = getStyle<Variants>({
  defaultStyle: "mx-auto bg-white border border-gray-100 rounded-lg",
  variants: {
    layout: {
      vertical: "flex flex-col gap-6",
      horizental: "flex items-center gap-2",
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
  },
  defaultVariants: {
    layout: "vertical",
    padding: "2",
    margin: "t-4",
  },
});

export default function Form({
  children,
  className,
  onSubmit,
  variants = null,
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
    >
      {children}
    </form>
  );
}
