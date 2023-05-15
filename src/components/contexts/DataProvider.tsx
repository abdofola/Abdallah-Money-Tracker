import { createContext, useContext, FC } from "react";
import { DataProviderProps, TDateContex } from "./types";

const DataContext = createContext<TDateContex | null>(null);

const useDate = () => {
  const dateContext = useContext(DataContext);
  if (!dateContext)
    throw new Error("dateContext must be used within `DataProvider` component");

  return dateContext;
};

const DataProvider: FC<DataProviderProps> = ({ children, ...rest }) => {
  return <DataContext.Provider value={rest}>{children}</DataContext.Provider>;
};

export { DataProvider as default, useDate };
