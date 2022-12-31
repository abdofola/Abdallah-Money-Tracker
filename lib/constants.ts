type Actions = {
  insert: "INSERT_ONE";
  filter: "RETRIEVE_BY_FILTER";
  update: "UPDATE_FORM";
  reset: "RESET_FORM";
};
type Transacion = {
  income: "income";
  expense: "expense";
};

const transactions = [{ name: "income" }, { name: "expense" }];

const categories = [
  { name: "paycheck", type: "income", color: "#B7C4CF" },
  { name: "rent", type: "expense", color: "#EEE3CB" },
  { name: "shopping", type: "expense", color: "#BFACE0" },
  { name: "fuel", type: "expense", color: "#E3C770" },
  { name: "electricity", type: "expense", color: "#0F3460" },
  { name: "grossary", type: "expense", color: "#A7D2CB" },
  { name: "gift", type: "income", color: "#FFC4C4" },
  { name: "dividend", type: "income", color: "#704F4F" },
];

const actionTypes: Actions = {
  insert: "INSERT_ONE",
  filter: "RETRIEVE_BY_FILTER",
  update: "UPDATE_FORM",
  reset: "RESET_FORM",
};

const transactionTypes: Transacion = {
  income: "income",
  expense: "expense",
};

/**
 * function to deep freeze single or array of objects
 * @param {T} obj accept single or array of objects.
 * @return returns the freezed object/array objects.
 */
function deepFreeze<T extends { [key: string]: any }>(obj: T): T {
  if (obj && typeof obj === "object" && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    Object.keys(obj).forEach((prop) => deepFreeze(obj[prop]));
  }
  return obj;
}

[transactions, categories, actionTypes, transactionTypes].forEach(deepFreeze);

export { transactions, categories, actionTypes, transactionTypes };
