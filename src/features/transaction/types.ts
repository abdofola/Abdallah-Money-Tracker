import React from "react";
import type { Url } from "url";
import { Transaction, User, Category as TCategory } from "@prisma/client";
import ReactDatePicker from "react-datepicker";
import { Register } from "@lib/helpers/hooks/useForm";

type Transform<T> = {
  income: T[];
  expenses: T[];
};
type PeriodType = "day" | "week" | "month" | "year" | "period";
type TransactionType = "income" | "expenses";
type Category = Omit<TCategory, "createdAt" | "updatedAt" | "userId"> & {
  name: { ar: string; en: string };
};
type TransactionElement = {
  key: string;
  color: string;
  value: Transaction['amount'];
  category: Category;
} & Transaction;
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
  user: User;
};
type DisplayProps = {
  periodIndex: number;
  transactionType: { en: TransactionType; ar: string };
  isLoading: boolean;
  isFetching: boolean;
  setPeriod: React.Dispatch<React.SetStateAction<number>>;
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

type RenderCategoryFnInput = {
  cat: Category;
  isSelected: boolean;
  icon: React.ReactElement;
  onClick: () => void;
  register: Register;
};
type CategoriesProps = {
  categories: Category[];
  canAddCategory?: boolean;
  selectedId: string ;
  renderCategory: ({
    cat,
    isSelected,
    onClick,
    icon,
  }: RenderCategoryFnInput) => JSX.Element;
  open?: () => void;
  setSelectedId: (id: string) => void;
  register: Register;
};
type CategoryProps = RenderCategoryFnInput;

type TransactionFormProps = {
  user: User;
  transactionType: "income" | "expenses";
  transactionComment?: string | null;
  transactionDate?: Date;
  categoryId?: string;
  transactionAmount?: string;
  canAddCategory?: boolean;
  btnJSX: ({ isLoading }: { isLoading: boolean }) => JSX.Element;
  displayOn: () => void;
  mutation: (input: any) => Promise<any>;
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
  CategoriesProps,
  CategoryProps,
  TransactionFormProps,
};
