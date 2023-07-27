import React from "react";

export default function useWindowResize(action=()=>{}) {
  const [windowWidth, setWindowWidth] = React.useState(0);
  /**
   * basically it should receive any action, and execute it on every paint
   */
  React.useEffect(() => {
    const resize = () => {
      setWindowWidth(window.innerWidth);
      action();
    };

    action();
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", resize);

    //cleanup
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [windowWidth, action]);

  return windowWidth;
}
