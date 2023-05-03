import React from "react";
import type { Url } from "url";
import { Role } from "@prisma/client";

type Transform<T> = {
  income: T[];
  expenses: T[];
};
type PeriodType = "day" | "week" | "month" | "year" | "period";
type TransactionType = "income" | "expenses";
type Category = {
  id: string;
  type: TransactionType;
  name: { ar: string; en: string };
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

type RenderCategoryFnInput = {
  cat: Category;
  isSelected: boolean;
  onClick: () => void;
  icon: React.ReactElement;
};
type CategoriesProps = {
  categories: Category[];
  canAddCategory?: boolean;
  selectedId?: string | null;
  renderCategory: ({
    cat,
    isSelected,
    onClick,
    icon,
  }: RenderCategoryFnInput) => JSX.Element;
  open?: () => void;
  setSelectedId?: React.Dispatch<React.SetStateAction<string | null>>;
};
type CategoryProps = RenderCategoryFnInput;

type TransactionFormProps = {
  user: { id: string; email: string; name?: string; role: Role };
  displayOn: () => void;
  transactionType: "income" | "expenses";
  mutation: (input: any) => Promise<typeof input>;
  transactionComment?: string;
  transactionDate?: Date;
  categoryId?: string;
  transactionAmount?: string;
  canAddCategory?: boolean;
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
  TransactionFormProps
};
