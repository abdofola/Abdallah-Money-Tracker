import { TransactionType, PeriodType } from "./types";

interface Config<T> {
  arr: Array<{ id: number; txt: { en: T; ar: string } }>;
}

const transactionTypes: Config<TransactionType>["arr"] = [
  { id: 0, txt: { en: "income", ar: "الدخل" } },
  { id: 1, txt: { en: "expenses", ar: "المصروف" } },
];

const periods: Config<PeriodType>["arr"] = [
  { id: 0, txt: { en: "day", ar: "اليوم" } },
  { id: 1, txt: { en: "week", ar: "الاسبوع" } },
  { id: 2, txt: { en: "month", ar: "الشهر" } },
  { id: 3, txt: { en: "year", ar: "السنة" } },
  { id: 4, txt: { en: "period", ar: "الفترة" } },
];

export { transactionTypes, periods };
