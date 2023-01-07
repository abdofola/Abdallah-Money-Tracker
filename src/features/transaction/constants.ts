import { TransactionType, PeriodType } from "./types";

const transactionTypes = Array.from(
  ["income", "expenses"],
  (v: TransactionType, idx) => ({
    id: idx,
    txt: v,
  })
);
const periods = Array.from(
  ["day", "week", "month", "year", "period"],
  (v: PeriodType, idx) => ({ id: idx, txt: v })
);

const income = [
  { id: 1, name: "salary", type: "income", iconId: "salary", color:'red' },
  { id: 2, name: "transfer", type: "income", iconId: "transfer",color:'blue' },
  { id: 3, name: "gift", type: "income", iconId: "gift", color:'green' },
];
const expenses = [
  { id: 1, name: "health", type: "expense", iconId: "health", color:'red' },
  { id: 2, name: "electricity", type: "expense", iconId: "electricity", color:'green' },
  { id: 3, name: "fuel", type: "expense", iconId: "fuel", color:'orange' },
  { id: 4, name: "transportation", type: "expense", iconId: "transportation", color:'purple' },
  { id: 5, name: "snacks", type: "expense", iconId: "snacks", color:'brown' },
  { id: 6, name: "groceries", type: "expense", iconId: "groceries", color:'blue' },

];
const categories = {income, expenses};

export { transactionTypes, periods, categories };
