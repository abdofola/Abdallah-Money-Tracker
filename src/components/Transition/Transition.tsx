import React from "react";
import { useDelayMountUnmount } from "@lib/helpers/hooks";

type P = {
  children?: React.ReactNode;
  isMounted: boolean;
  from?: string;
  to?: string;
  as?: React.ElementType | (() => JSX.Element);
  className?: string;
  delay?: number;
};

export default function Transition({
  children,
  isMounted,
  from,
  to,
  as = "div",
  className = "",
  delay = 100,
}: P) {
  const shouldRender = useDelayMountUnmount(isMounted, delay);
  const Element = as;
  const transitionSwitcher = isMounted && shouldRender ? to : from;
  const style = `${className} ${
    transitionSwitcher ? "transition-all " + transitionSwitcher : ""
  }`;

  if (!isMounted && !shouldRender) return null;

  // if no transition style provided and `as` doesn't return JSX; then no need for wrapper element.
  if (!transitionSwitcher && !(as instanceof Function)) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return <Element className={style}>{children}</Element>;
}
