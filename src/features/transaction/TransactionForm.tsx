import React from "react";
import { Check, Icon } from "@components/icons";
import DateSelection from "./DateSelection";
import { AddTransactionProps } from "./types";
import { Form, Spinner } from "@components/ui";
import { useRouter } from "next/router";
import { en, ar } from "@locales";

function TransactionForm({
  user,
  displayOn = () => {},
  transactionType,
  mutation,
  status = { isLoading: false },
  transactionComment,
  transactionDate,
  categoryId,
  transactionAmount,
}) {
  const amountRef = React.useRef<HTMLInputElement | null>(null);
  const { locale } = useRouter();
  const [date, setDate] = React.useState(transactionDate ?? new Date());
  const [selectedId, setSelectedId] = React.useState<string | null>(
    categoryId ?? null
  );
  const [amountValue, setAmountValue] = React.useState(transactionAmount ?? "");
  const [comment, setComment] = React.useState(transactionComment ?? "");
  const [selectedTransaction, setSelectedTransaction] =
    React.useState(transactionType); // `transactionType` is mirrored in a state; in order to know when `transactionType` changes. Note:useRef doesn't do the job.

  const canAdd = !status.isLoading && selectedId && amountValue;
  const translation = locale === "en" ? en : ar;
  const reset = () => {
    setSelectedId(null);
    setAmountValue("");
    setDate(new Date());
    setComment("");
  };
  const handleSubmit = (formData) => {
    mutation({ ...formData, date, amount: Number(amountValue) })
      .then((payload) => {
        console.log({ payload });
        reset();
        displayOn();
      })
      .catch((error) => console.log({ error }));
  };

  // resetting the `selectedId` when switching between tabs.
  if (selectedTransaction !== transactionType) {
    setSelectedId(null);
    setSelectedTransaction(transactionType);
  }

  React.useEffect(() => {
    amountRef.current?.focus();
  }, []);

  return (
    <Form
      variants={{ padding: 4 }}
      className="max-w-[29rem]"
      onSubmit={handleSubmit}
    >
      {/* amount */}
      <div className="flex flex-col gap-1">
        <label htmlFor="amount" className=" text-gray-400">
          {translation.transactionDetails.amount}
        </label>
        <div className="flex gap-2 items-center">
          <input
            className="transition basis-full px-2 py-1 bg-gray-100 shadow-inner rounded-md ring-offset-4 focus:outline-0  focus:ring-1 focus:ring-gray-300"
            ref={amountRef}
            id="amount"
            type="number"
            name="amount"
            value={amountValue}
            onChange={(e) => setAmountValue(e.target.value)}
          />
          <span>{translation.transactionDetails.currency}</span>
        </div>
      </div>
      {/* categories */}
      <div className="flex flex-col gap-1">
        <span className="text-gray-400">{translation.transactionDetails.category}</span>
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
                  {name[locale]}
                </span>
                <input
                  className="appearance-none"
                  id={iconId}
                  type="radio"
                  name="categoryId"
                  value={id}
                  defaultChecked={selectedId === id}
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
          {translation.transactionDetails.date}
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
          {translation.transactionDetails.comment}
        </label>
        <textarea
          ref={(elem) => {
            // if it's rendered with content, make the height equals to the content.
            if (elem) elem.style.height = elem.scrollHeight + "px";
          }}
          id="comment"
          name="comment"
          className="transition px-2 py-px bg-gray-100 shadow-inner rounded-md resize-none focus:outline-0 ring-offset-4 focus:ring-1 focus:ring-gray-300"
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
          className={`flex justify-center items-center capitalize py-1 basis-1/3 rounded-lg shadow ${
            !canAdd ? "text-gray-300" : ""
          }`}
          type="submit"
          disabled={!canAdd}
        >
          {!status.isLoading ? translation.buttons.add : <Spinner />}
        </button>
        <button type="reset" className="text-gray-400" onClick={reset}>
          {translation.buttons.reset}
        </button>
        <button
          type="button"
          className="px-2 text-gray-500 bg-gray-50 rounded-lg"
          style={{ marginInlineStart: "auto" }}
          onClick={displayOn}
        >
          {translation.buttons.back}
        </button>
      </div>
    </Form>
  );
}

export default TransactionForm;
