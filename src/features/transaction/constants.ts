import { TransactionType, PeriodType, Category } from "./types";

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

const otherCategories = {
  income: [
    {
      id: "0_income",
      name: { en: "comission", ar: "علاوة" },
      type: "income",
      color: "#F5F3C1",
      iconId: "comission",
    },
    {
      id: "1_income",
      name: { en: "investment", ar: "استثمار" },
      type: "income",
      color: "#FFA559",
      iconId: "investment",
    },
    {
      id: "2_income",
      name: { en: "interest", ar: "فائدة" },
      type: "income",
      color: "#C7E9B0",
      iconId: "interest",
    },
    {
      id: "3_income",
      name: { en: "others", ar: "أخرى" },
      type: "income",
      color: "#C7E9B0",
      iconId: "others",
    },
  ],
  expenses: [
    {
      id: "0",
      name: { en: "SIM credit", ar: "رصيد بطاقة جوال" },
      type: "expenses",
      color: "#1A5F7A",
      iconId: "SIM",
    },
    {
      id: "1",
      name: { en: "rent", ar: "إيجار" },
      type: "expenses",
      color: "#A84448",
      iconId: "rent",
    },
    {
      id: "2",
      name: { en: "insurance", ar: "تأمين" },
      type: "expenses",
      color: "#B9F3FC",
      iconId: "insurance",
    },
    {
      id: "3",
      name: { en: "others", ar: "أخرى" },
      type: "expenses",
      color: "#C7E9B0",
      iconId: "others",
    },

  ],  
};

export { transactionTypes, periods, otherCategories };
