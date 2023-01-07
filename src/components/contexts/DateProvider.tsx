import React from "react";
import { DateProviderProps, TDateContex } from "./types";

const DateContext = React.createContext<TDateContex | null>(null);

const useDate = () => {
  const dateContext = React.useContext(DateContext);
  if (!dateContext)
    throw new Error("dateContext must be used within `DateProvider` component");

  return dateContext;
};

const DateProvider: React.FC<DateProviderProps> = ({ children, ...rest }) => {
  console.log("DateProvider");
  return <DateContext.Provider value={rest}>{children}</DateContext.Provider>;
};

export { DateProvider as default, useDate };
