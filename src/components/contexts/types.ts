import { TransactionElement } from "@features/transaction/types";

type TDateContex = {
  data: TransactionElement[];
  startDate: Date;
  endDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

type TDataContext<T = TransactionElement> = [
  data: { income: T[] | null; expenses: T[] | null },
  setData: React.Dispatch<React.SetStateAction<T[]>>
];
type DataProviderProps = {
  children: React.ReactNode;
} & TDateContex;

export type {
  TDateContex,
  DataProviderProps,
  TDataContext,
  TransactionElement,
};
