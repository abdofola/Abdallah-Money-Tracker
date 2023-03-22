import React, { SetStateAction } from "react";
import type { Url } from "url";

type Transform<T> = {
  income: T[];
  expenses: T[];
};
type PeriodType = "day" | "week" | "month" | "year" | "period";
type TransactionType = "income" | "expenses";
type Category = {
  id: string;
  type: TransactionType;
  name: string;
  color: string;
  iconId: string;
  [key: string]: any;
};
type TransactionElement = {
  id: string;
  category: Category;
  amount: number;
  comment: string | undefined;
  date: Date | string;
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
  user: {
    id: string;
    categories: Transform<Category>;
  };
};
type DisplayProps = {
  transactionType: { en: TransactionType; ar: string };
  setPeriod: React.Dispatch<React.SetStateAction<number>>;
  periodIndex: number;
  displayOff: () => void;
};

type DateSelectionProps = {
  className?: string;
  periodRef?: React.MutableRefObject<HTMLButtonElement | null>;
  showMonthYearPicker?: boolean;
  showYearPicker?: boolean;
  selectsRange?: boolean;
  startDate: Date;
  endDate?: null | Date;
  onChange: (date: Date | [Date | null, Date | null] | null) => void;
  period: PeriodType;
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
  item: TransactionElement;
  percentage?: string;
  href: Partial<Url>;
  withComment?: boolean;
};
type TransactionListProps<T = TransactionElement> = {
  data: T[];
  renderItem: (item: T) => JSX.Element;
  className?: string;
};

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
  TransactionListProps,
  Transform,
};
