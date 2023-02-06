import React from "react";
import { Check, Icon } from "@components/icons";
import DateSelection from "./DateSelection";
import { AddTransactionProps } from "./types";
import { useAddTransactionMutation } from "@services";
import { Spinner } from "@components/ui";

function AddTransaction({
  user,
  displayOn,
  transactionType,
}: AddTransactionProps) {
  const amountRef = React.useRef<HTMLInputElement | null>(null);
  const [date, setDate] = React.useState(new Date());
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [amountValue, setAmountValue] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [selectedTransaction, setSelectedTransaction] =
    React.useState(transactionType); // `transactionType` is mirrored in a state; in order to know when `transactionType` changes. Note:useRef doesn't do the job.

  const [addTransaction, { isLoading }] = useAddTransactionMutation();
  const canAdd = !isLoading && selectedId && amountValue;
  const reset = () => {
    setSelectedId(null);
    setAmountValue("");
    setDate(new Date());
    setComment("");
  };
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    addTransaction({
      ...Object.fromEntries(formData),
      amount: Number(amountValue),
      date,
      userId: user.id,
    })
      .unwrap()
      .then((payload) => {
        // console.log({ payload });
        reset();
        displayOn();
      })
      .catch((error) => console.log({ error }));
  };

  React.useEffect(() => {
    amountRef.current?.focus();
  }, []);

  // resetting the selectedId when switching between tabs.
  if (selectedTransaction !== transactionType) {
    setSelectedId(null);
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
        <div className="flex space-x-1">
          <input
            className="transition basis-full px-2 py-1 bg-gray-100 shadow-inner rounded-md ring-offset-4 focus:outline-none  focus:ring-1 focus:ring-gray-300"
            ref={amountRef}
            id="amount"
            type="number"
            name="amount"
            value={amountValue}
            onChange={(e) => setAmountValue(e.target.value)}
          />
          <span>SDG</span>
        </div>
      </div>
      {/* categories */}
      <div className="flex flex-col gap-1">
        <span className="text-gray-400">categories</span>
        <div className="grid grid-cols-4 gap-4">
          {user.categories[selectedTransaction].map(
            ({ iconId, id, color, name }) => (
              <label
                key={iconId}
                htmlFor={iconId}
                onClick={() => setSelectedId(id)}
                className={`relative flex flex-col items-center -mx-2 rounded-md cursor-pointer ${
                  selectedId === id ? "bg-gray-100 shadow-inner" : ""
                }`}
              >
                <span
                  style={{
                    borderBottom: `4px solid ${
                      selectedId !== id ? color : "transparent"
                    }`,
                  }}
                  className={`p-2 ${
                    selectedId !== id ? `rounded-full shadow-sm` : ""
                  }`}
                >
                  <Icon
                    href={`/${selectedTransaction}/sprite.svg#${iconId}`}
                    className="w-10 h-10 "
                  />
                </span>
                <span className="w-full text-sm capitalize overflow-hidden text-ellipsis text-center">
                  {name}
                </span>
                <input
                  className="appearance-none"
                  id={iconId}
                  type="radio"
                  name="categoryId"
                  value={id}
                  // defaultChecked={selectedId === id}
                />
                {selectedId === id && (
                  <span className="absolute right-1 top-1 p-px border border-green-400 bg-green-100 rounded-full">
                    <Check className="w-3 h-3 fill-green-600" />
                  </span>
                )}
              </label>
            )
          )}
        </div>
      </div>
      {/* date */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-400" htmlFor="date">
          date
        </label>
        <DateSelection
          date={date}
          setDate={setDate}
          className="transition w-full px-2 py-1 text-start bg-gray-100 shadow-inner rounded-md ring-offset-4 focus:outline-none  focus:ring-1 focus:ring-gray-300"
        />
      </div>
      {/* comment */}
      <div className="flex flex-col gap-1">
        <label htmlFor="comment" className="text-gray-400">
          comment
        </label>
        <textarea
          id="comment"
          name="comment"
          className="transition px-2 py-px bg-gray-100 shadow-inner rounded-md resize-none focus:outline-none ring-offset-4 focus:ring-1 focus:ring-gray-300"
          value={comment}
          onChange={(e) => {
            const { value, style } = e.target;
            setComment(value);
            // the next 2 lines for increasing & decreasing the height of the `textarea` dynamically.
            style.height = "inherit";
            style.height = e.target.scrollHeight + "px";
          }}
        />
      </div>
      {/* buttons */}
      <div className="flex gap-2">
        <button
          className={`flex justify-center items-center capitalize p-1 basis-1/3 rounded-lg shadow-md ${
            !canAdd ? "text-gray-300" : ""
          }`}
          type="submit"
          disabled={!canAdd}
        >
          {!isLoading ? "add" : <Spinner />}
        </button>
        <button className="border-b p-1" type="reset" onClick={reset}>
          reset
        </button>
        <button
          className="border-b p-1  ml-auto"
          type="button"
          onClick={displayOn}
        >
          back
        </button>
      </div>
    </form>
  );
}

export default AddTransaction;
