import React from "react";

export function useGetHeight(selector: string) {
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    const elem = window.document.querySelector(selector);

    // no element match the specified selector
    if (!elem) throw new Error(`${selector} is not a valid selector`);

    setHeight(elem.clientHeight);
  }, [selector]);

  return height;
}
