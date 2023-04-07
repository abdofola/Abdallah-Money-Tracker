import { TransactionElement } from "@features/transaction/types";

type TDateContex = {
  data: TransactionElement[];
  startDate: Date;
  endDate: Date | null;
  dispatch: React.Dispatch<{
    [k in keyof Pick<TDateContex, "startDate" | "endDate">]: Date | null;
  }>;
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
