import React from "react";
import useWindowResize from "./useWindowResize";

export function useGetHeight(selector: string) {
  const [height, setHeight] = React.useState(0);
  
  useWindowResize(() => {
    const elem = window.document.querySelector(selector);
    // no element matches the specified selector
    if (!elem) {
      console.warn(`${selector} is not a valid selector`);
      return;
    }
    setHeight(elem.clientHeight);
  });

  return height;
}
