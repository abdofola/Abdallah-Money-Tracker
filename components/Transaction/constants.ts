import { TransactionType, PeriodType } from "./types";

const transactions = Array.from(
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
  
  export {transactions, periods};