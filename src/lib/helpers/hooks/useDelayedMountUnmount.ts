import React from "react";

/** custom hook to artificially delay the mount/ unmount of a component */
export function useDelayMountUnmount(
  isMounted: boolean,
  delayTime: number = 100
) {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    let timeoutId: number;
    if (isMounted && !shouldRender) {
      //mounting
      timeoutId = window.setTimeout(() => setShouldRender(true), delayTime);
    } else if (!isMounted && shouldRender) {
      //unmounting
      timeoutId = window.setTimeout(() => setShouldRender(false), delayTime);
    }

    // cleanup
    return () => window.clearTimeout(timeoutId);
  }, [isMounted, delayTime, shouldRender]);

  return shouldRender;
}
