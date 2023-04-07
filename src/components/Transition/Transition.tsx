import React from "react";
import { useDelayMountUnmount } from "@lib/helpers/hooks";

type P = {
  children: React.ReactNode;
  isMounted: boolean;
  from?: string;
  to?: string;
  delay?: number;
};

export default function Transition({
  children,
  isMounted,
  from,
  to,
  delay = 100,
}: P) {
  const shouldRender = useDelayMountUnmount(isMounted, delay);

  const className = isMounted && shouldRender ? to : from;

  if (!isMounted && !shouldRender) return null;

  return <div className={`transition-all ${className}`}>{children}</div>;
}
