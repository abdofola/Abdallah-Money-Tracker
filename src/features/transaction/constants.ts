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

const categories:{income:Category[], expenses:Category[]} = {
  income: [
    {
      id: "0_lS",
      name: { en: "salary", ar: "مرتب" },
      color: "blue",
      iconId: "salary",
      type: "income",
    },
    {
      id: "1_lS",
      name: { en: "transfer", ar: "حوالة" },
      color: "skyblue",
      iconId: "transfer",
      type: "income",
    },
    {
      id: "2_lS",
      name: { en: "gift", ar: "هدية" },
      color: "orange",
      iconId: "gift",
      type: "income",
    },
  ],
  expenses: [
    {
      id: "0_lS",
      name: { en: "groceries", ar: "خضروات" },
      color: "lavender",
      iconId: "groceries",
      type: "expenses",
    },
    {
      id: "1_lS",
      name: { en: "education", ar: "تعليم" },
      color: "blueviolet",
      iconId: "education",
      type: "expenses",
    },
    {
      id: "2_lS",
      name: { en: "health", ar: "صحة" },
      color: "orchid",
      iconId: "health",
      type: "expenses",
    },
    {
      id: "3_lS",
      name: { en: "electricity", ar: "كهرباء" },
      color: "gold",
      iconId: "electricity",
      type: "expenses",
    },
    {
      id: "4_lS",
      name: { en: "snacks", ar: "وجبات" },
      color: "teal",
      iconId: "snacks",
      type: "expenses",
    },
    {
      id: "5_lS",
      name: { en: "transportation", ar: "مواصلات" },
      color: "tan",
      iconId: "transportation",
      type: "expenses",
    },
    {
      id: "6_lS",
      name: { en: "fuel", ar: "بنزين" },
      color: "magenta",
      iconId: "fuel",
      type: "expenses",
    },
  ],
};
const otherCategories:{income:Category[], expenses:Category[]} = {
  income: [
    {
      id: "0_income_others",
      name: { en: "comission", ar: "علاوة" },
      type: "income",
      color: "#F5F3C1",
      iconId: "comission",
    },
    {
      id: "1_income_others",
      name: { en: "investment", ar: "استثمار" },
      type: "income",
      color: "#FFA559",
      iconId: "investment",
    },
    {
      id: "2_income_others",
      name: { en: "interest", ar: "فائدة" },
      type: "income",
      color: "#dd7baf",
      iconId: "interest",
    },
    {
      id: "3_income_others",
      name: { en: "others", ar: "أخرى" },
      type: "income",
      color: "#C7E9B0",
      iconId: "others",
    },
  ],
  expenses: [
    {
      id: "0_expenses_others",
      name: { en: "SIM credit", ar: "رصيد بطاقة جوال" },
      type: "expenses",
      color: "#435571",
      iconId: "SIM",
    },
    {
      id: "1_expenses_others",
      name: { en: "rent", ar: "إيجار" },
      type: "expenses",
      color: "#A84448",
      iconId: "rent",
    },
    {
      id: "2_expenses_others",
      name: { en: "insurance", ar: "تأمين" },
      type: "expenses",
      color: "#B9F3FC",
      iconId: "insurance",
    },
    {
      id: "3_expenses_others",
      name: { en: "others", ar: "أخرى" },
      type: "expenses",
      color: "#C7E9B0",
      iconId: "others",
    },

  ],  
};

export { transactionTypes, periods, categories, otherCategories };
