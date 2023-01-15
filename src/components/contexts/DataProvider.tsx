import React from "react";
import { TDataContext, TransactionElement } from "./types";

const DataContext = React.createContext<TDataContext | null>(null);

const useData = () => {
  const dataContext = React.useContext(DataContext);

  if (!dataContext)
    throw new Error(
      "dataContext must be used within `DataProvider` component."
    );

  return dataContext;
};

function DataProvider(props:{children:React.ReactNode}) {
  const [data, setData] = React.useState<TDataContext["data"]>({
    income: null,
    expenses: null,
  });
  return <DataContext.Provider value={[data, setData]} {...props} />;
}

export { DataProvider as default, useData };
