import { TransactionElement } from "@components/Transaction/types";

type TDateContex = {
  data: TransactionElement[];
  startDate: Date;
  endDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

type DateProviderProps = {
  children: React.ReactNode;
} & TDateContex;

export type { TDateContex, DateProviderProps };
