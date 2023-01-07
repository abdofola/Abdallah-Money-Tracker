import React from "react";

export function useDelayUnmount(isMounted: boolean, delayTime: number) {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    let timeoutId: number;
    if (isMounted && !shouldRender) setShouldRender(true);
    else if (!isMounted && shouldRender) {
      timeoutId = window.setTimeout(() => setShouldRender(false), delayTime);
    }
    return () => window.clearTimeout(timeoutId);
  }, [isMounted, delayTime, shouldRender]);
  
  return shouldRender;
}
