import React, { SetStateAction } from "react";
import { ReactDatePickerProps } from "react-datepicker";

type PeriodType = "day" | "week" | "month" | "year" | "period";
type TransactionType = "income" | "expenses";
type Category = {
  id: string;
  type: TransactionType;
  name: string;
  color: string;
  iconId: string;
  [key: string]: any
};
type TransactionElement = {
  id: string;
  category: Category;
  amount: number;
  comment: string | undefined;
  date: Date | string
  [key: string]: any;
};
type FilterTransactions = ({
  data,
  periodType,
  selectedDate,
}: {
  data: TransactionElement[];
  periodType: PeriodType;
  selectedDate: { start: Date; end?: Date };
}) => TransactionElement[];

// COMPONENTS
type TransactionProps = {
  data: { [key in TransactionType]: TransactionElement[] };
};
type DisplayProps = {
  transactionType: TransactionType;
  setPeriod: React.Dispatch<React.SetStateAction<number>>;
  periodIndex: number;
  displayOff: () => void;
};

type DateSelectionProps = {
  className?: string;
  selection?: PeriodType;
  filter?: ({ start, end }: { start: Date; end: Date | null }) => void;
  periodRef?: React.MutableRefObject<HTMLButtonElement | null>;
  date?: Date;
  setDate?: ReactDatePickerProps["onChange"] | React.Dispatch<SetStateAction<Date>>;
};

type DateButtonProps = {
  className: string;
  customValue: string;
  periodRef: DateSelectionProps["periodRef"];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  [key: string]: any;
};

type AddTransactionProps = {
  displayOn: () => void;
  transactionType: TransactionType;
  incomeIcons?: string[];
  expenseIcons?: string[];
};

type TransactionItemProps = {
  item: TransactionElement,
  percentage:string
}
type TransactionListProps<T=TransactionElement> = {
  data: T[],
  renderItem: (item:T)=> JSX.Element,
  className?:string
}

export type {
  TransactionProps,
  DisplayProps,
  PeriodType,
  TransactionType,
  TransactionElement,
  FilterTransactions,
  DateSelectionProps,
  DateButtonProps,
  AddTransactionProps,
  Category,
  TransactionItemProps,
  TransactionListProps
};
