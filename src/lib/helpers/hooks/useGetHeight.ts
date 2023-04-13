import React from "react";

export function useGetHeight(selector: string) {
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    const elem = window.document.querySelector(selector);

    // no element matches the specified selector
    if (!elem) {
      console.warn(`${selector} is not a valid selector`);
      return;
    }

    setHeight(elem.clientHeight);
  }, [selector]);

  return height;
}
