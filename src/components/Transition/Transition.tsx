import React from "react";
import { useDelayMountUnmount } from "@lib/helpers/hooks";

type P = {
  children: React.ReactNode;
  isMounted: boolean;
  isAnimated?: boolean;
  from?: string;
  to?: string;
};

export default function Transition({
  children,
  isMounted,
  from,
  to,
  isAnimated = false,
}: P) {
  const shouldRender = useDelayMountUnmount(isMounted);

  const className = isMounted && shouldRender ? to : from;

  if (!isMounted && !shouldRender) return null;

  if (isMounted && !isAnimated) return children;

  return <div className={`transition-all ${className}`}>{children}</div>;
}
