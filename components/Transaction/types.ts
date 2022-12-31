import React from "react";
import { ReactDatePickerProps } from "react-datepicker";

type PeriodType = "day" | "week" | "month" | "year" | "period";
type TransactionType = "income" | "expenses";
type TransactionElement = {
  [key in PeriodType]: any;
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
  className: string;
  selection: PeriodType;
  filter?: ({ start, end }: { start: Date; end: Date | null }) => void;
  periodRef: React.MutableRefObject<HTMLButtonElement | null>;
  date?: Date;
  setDate?: ReactDatePickerProps["onChange"];
};

type DateButtonProps = {
  className: string;
  customValue: string;
  periodRef: DateSelectionProps["periodRef"];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  [key: string]: any;
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
};
