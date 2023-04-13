import { createContext, useContext, FC } from "react";
import { DataProviderProps, TDateContex } from "./types";

const DateContext = createContext<TDateContex | null>(null);

const useDate = () => {
  const dateContext = useContext(DateContext);
  if (!dateContext)
    throw new Error("dateContext must be used within `DataProvider` component");

  return dateContext;
};

const DataProvider: FC<DataProviderProps> = ({ children, ...rest }) => {
  return <DateContext.Provider value={rest}>{children}</DateContext.Provider>;
};

export { DataProvider as default, useDate };
