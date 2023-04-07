import React from "react";

export function useDelayMountUnmount(isMounted: boolean, delayTime: number = 200) {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    let timeoutId: number;
    if (isMounted && !shouldRender) {
      timeoutId = window.setTimeout(() => setShouldRender(true), delayTime);
    } else if (!isMounted && shouldRender) {
      timeoutId = window.setTimeout(() => setShouldRender(false), delayTime);
    }

    // cleanup
    return () => window.clearTimeout(timeoutId);
  }, [isMounted, delayTime, shouldRender]);

  return shouldRender;
}
