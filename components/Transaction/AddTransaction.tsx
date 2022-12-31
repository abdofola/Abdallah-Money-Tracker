import { Check } from "@components/icons";
import React from "react";
import DateSelection from "./DateSelection";
import { TransactionType } from "./types";

type AddTransactionProps = {
  displayOn: () => void;
  transactionType: TransactionType;
  incomeIcons?: string[];
  expenseIcons?: string[];
};

function AddTransaction({
  displayOn,
  transactionType,
  incomeIcons = ["salary", "transfer", "gift"],
  expenseIcons = [
    "groceries",
    "fuel",
    "health",
    "snacks",
    "transportation",
    "electricity",
  ],
}: AddTransactionProps) {
  const [date, setDate] = React.useState(new Date());
  const [selectedTransaction, setSelectedTransaction] =
    React.useState(transactionType);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [categories] = React.useState(() => {
    return {
      income: Array.from(incomeIcons, (v, k) => ({ iconId: v, id: k })),
      expenses: Array.from(expenseIcons, (v, k) => ({
        iconId: v,
        id: k,
      })),
    };
  });
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.append("date", date);

    console.log("formJson", Object.fromEntries(formData));
  };

  // resetting the selectedIndex when switching between tabs.
  if (selectedTransaction !== transactionType) {
    setSelectedIndex(null);
    setSelectedTransaction(transactionType);
  }

  return (
    <form
      className="flex flex-col gap-6 bg-white mt-4 p-4 rounded-lg border border-gray-100"
      onSubmit={handleSubmit}
    >
      {/* amount */}
      <div className="flex flex-col gap-1">
        <label htmlFor="amount" className=" text-gray-400">
          amount
        </label>
        <div className="space-x-1">
          <input
            id="amount"
            type="number"
            name="amount"
            className="w-min px-2 bg-gray-100 shadow-inner rounded-md"
          />
          <span>SDG</span>
        </div>
      </div>
      {/* categories */}
      <div className="flex flex-col gap-1">
        <span className="text-gray-400">categories</span>
        <div className="grid grid-cols-4 gap-4">
          {categories[selectedTransaction].map(({ iconId, id }) => (
            <label
              key={iconId}
              htmlFor={iconId}
              onClick={() => setSelectedIndex(id)}
              name="category"
              className={`relative flex flex-col items-center -mx-2 rounded-md cursor-pointer ${
                selectedIndex === id
                  ? "outline outline-1 outline-gray-400"
                  : ""
              }`}
            >
              <span
                className={`p-2 ${
                  selectedIndex !== id
                    ? "outline outline-1 outline-gray-200 rounded-full"
                    : ""
                }`}
              >
                <Icon
                  categoryType={selectedTransaction}
                  iconId={iconId}
                  className="w-10 h-10"
                />
              </span>
              <span className="text-sm capitalize">{iconId}</span>
              <input
                id={iconId}
                type="radio"
                name="category"
                className="appearance-none"
                value={iconId}
              />
              {selectedIndex === id && (
                <span className="absolute right-1 top-1 p-px border border-green-400 bg-green-100 rounded-full">
                  <Check className="w-3 h-3 fill-green-600" />
                </span>
              )}
            </label>
          ))}
        </div>
      </div>
      {/* date */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-400" htmlFor="date">
          date
        </label>
        <DateSelection date={date} setDate={setDate} />
      </div>
      {/* comment */}
      <div className="flex flex-col gap-1">
        <label htmlFor="comment" className="text-gray-400">
          comment
        </label>
        <textarea
          id="comment"
          name="comment"
          className="px-2 bg-gray-100 shadow-inner rounded-md resize-none"
          onChange={(e) => {
            e.target.style.height = "inherit";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
        />
      </div>
      {/* buttons */}
      <div className="flex gap-2">
        <button className="border p-1 rounded-lg" type="submit">
          add
        </button>
        <button
          className="border p-1 rounded-lg"
          type="reset"
          onClick={() => setSelectedIndex(null)}
        >
          reset
        </button>
        <button
          className="border p-1 rounded-lg ml-auto"
          type="button"
          onClick={displayOn}
        >
          back
        </button>
      </div>
    </form>
  );
}

function Icon({ categoryType, iconId, ...style }) {
  return (
    <svg {...style}>
      <use href={`/${categoryType}/sprite.svg#${iconId}`} />
    </svg>
  );
}

export default AddTransaction;
