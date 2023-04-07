import React from "react";
import DateSelection from "./DateSelection";
import { Form, Modal, Spinner } from "@components/ui";
import { useRouter } from "next/router";
import { en, ar } from "@locales";
import { CategoryList, Category } from "./index";
import { otherCategories } from "./constants";
import { useAddCategoryMutation } from "@app/services/api";
import { Category as TCategory } from "./types";
import { Transition } from "@components/Transition";

function TransactionForm({
  user,
  displayOn = () => {},
  transactionType,
  mutation = (value: any) => Promise.resolve(value),
  status = { isLoading: false },
  transactionComment,
  transactionDate,
  categoryId,
  transactionAmount,
  canAddCategory = true,
}) {
  const amountRef = React.useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [date, setDate] = React.useState(transactionDate ?? new Date());
  const [selectedId, setSelectedId] = React.useState<string | null>(
    categoryId ?? null
  );
  const [amountValue, setAmountValue] = React.useState(transactionAmount ?? "");
  const [comment, setComment] = React.useState(transactionComment ?? "");
  const { locale } = useRouter();
  const [addCategory, { isLoading }] = useAddCategoryMutation();

  const canAdd = !status.isLoading && selectedId && amountValue;
  const translation = locale === "en" ? en : ar;

  const reset = () => {
    setSelectedId(null);
    setAmountValue("");
    setDate(new Date());
    setComment("");
  };
  const handleSubmit = (formData) => {
    console.log({ formData });
    if (formData.categoryId == null) return;

    mutation({ ...formData, date, amount: Number(amountValue) })
      .then((payload) => console.log({ payload }))
      .catch((error) => console.log({ error }))
      .finally(() => {
        // after promise is settled
        reset();
        displayOn();
      });
  };

  // to disconnect `selectedId` in the form, from the one in `Modal` component.
  if (isOpen && selectedId) {
    setSelectedId(null);
  }

  // focus input on component first mount
  React.useEffect(() => {
    amountRef.current?.focus();
  }, []);

  return (
    <Form
      id="add-trx"
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
            min={0}
            name="amount"
            value={amountValue}
            onChange={(e) => setAmountValue(e.target.value)}
          />
          <span>{translation.transactionDetails.currency}</span>
        </div>
      </div>
      {/* categories */}
      <div className="flex flex-col gap-1">
        <span className="text-gray-400">
          {translation.transactionDetails.category}
        </span>
        <CategoryList
          canAddCategory={canAddCategory}
          categories={user.categories[transactionType]}
          setSelectedId={setSelectedId}
          selectedId={selectedId}
          open={() => setIsOpen(true)}
          renderCategory={(props) => <Category key={props.cat.id} {...props} />}
        />
        <Transition isMounted={isOpen}>
          <Modal
            isMounted={isOpen}
            headerTxt={translation.headings.addCategory}
            close={() => setIsOpen(false)}
            onConfirm={(data) => {
              const selectedCategory = otherCategories[transactionType].find(
                (c) => c.id === data.categoryId
              ) as TCategory | undefined;

              if (selectedCategory) {
                const { id, ...newCategory } = selectedCategory;
                addCategory({ ...newCategory, userId: user.id })
                  .unwrap()
                  .then((payload) => console.log({ payload }))
                  .catch((error) => console.log({ error }))
                  .finally(() => setIsOpen(false));
              }
            }}
            confirmationButton={
              <button className="flex justify-center basis-1/3 bg-black text-white py-1 rounded-md">
                {isLoading ? <Spinner /> : translation.buttons.add}
              </button>
            }
          >
            <CategoryList
              categories={otherCategories[transactionType]}
              renderCategory={(props) => {
                return <Category key={props.cat.id} {...props} />;
              }}
            />
          </Modal>
        </Transition>
      </div>
      {/* date */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-400" htmlFor="date">
          {translation.transactionDetails.date}
        </label>
        <DateSelection
          className="transition w-full px-2 py-1 text-start bg-gray-100 shadow-inner rounded-md ring-offset-4 focus:outline-none  focus:ring-1 focus:ring-gray-300"
          period="day"
          startDate={date}
          onChange={(date) => setDate(date)}
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
      <menu className="flex gap-2">
        {/* TODO: this propably should be refactored, to receive the submit button as prop */}
        <button
          id="add-trx"
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
      </menu>
    </Form>
  );
}

export default TransactionForm;
