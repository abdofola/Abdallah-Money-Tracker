import React from "react";
import DateSelection from "./DateSelection";
import { Form, Modal, Spinner } from "@components/ui";
import { useRouter } from "next/router";
import { en, ar } from "@locales";
import { Category } from "./index";
import { otherCategories } from "./constants";
import { useAddCategoryMutation, useGetCategoriesQuery } from "@app/services";
import { Category as TCategory } from "./types";
import { Transition } from "@components/Transition";
import { FormProps } from "@components/ui/Form";
import { useLocalStorage } from "@lib/helpers/hooks";
import { categories as defaultCategories } from "./constants";

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
  const { data, isFetching } = useGetCategoriesQuery({ userId: user.id });
  const [addCategory, { isLoading }] = useAddCategoryMutation();
  const [categories, setCategories] = useLocalStorage(
    "categories",
    defaultCategories
  );
  const { locale } = useRouter();
  const categoryToUpdate = data?.[transactionType].find(
    (c) => c.id === selectedId
  );
  const canAdd = !status.isLoading && !isLoading && selectedId && amountValue;
  const translation = locale === "en" ? en : ar;

  const reset = () => {
    setSelectedId(null);
    setAmountValue("");
    setDate(new Date());
    setComment("");
  };
  const handleSubmit: FormProps["onSubmit"] = async (formData) => {
    console.log({ amountValue, selectedId, date });

    if (amountValue <= 0 || !selectedId || !(date instanceof Date)) {
      return;
    }
    const selectedCategory = categories[transactionType].find((c) => {
      return c.id === selectedId;
    });
    const matchedSelection = data[transactionType].find(
      (c) => c.iconId === selectedCategory.iconId
    );
    const { id, ...payload } = selectedCategory;

    try {
      let catId: string;
      // check to see if user has the selected the category or not,
      // to decide whether to add it or not(i.e perform POST request).
      if (!matchedSelection) {
        const newCategory = await addCategory({
          userId: user.id,
          ...payload,
        }).unwrap();
        catId = newCategory.addCategory.id;
      } else {
        catId = matchedSelection.id;
      }
      const newTrx = await mutation({
        ...formData,
        categoryId: catId,
        date,
        amount: Number(amountValue),
      });
      console.log({ newTrx });
    } catch (err) {
      console.log({ err });
    } finally {
      reset();
      displayOn();
    }
  };

  // when it's update operation, update `selectedId` to match the one in localStorage
  if (categoryId && categoryToUpdate && selectedId === categoryToUpdate.id) {
    const selectedCategory = categories[transactionType].find(
      (c) => c.iconId === categoryToUpdate.iconId
    );
    setSelectedId(selectedCategory.id);
  }
  // console.log({selectedCategory})

  // focus input on component first mount
  React.useEffect(() => {
    // the desired behavior to trigger the focus,
    // with showing device's keyboard, it's annoying
    // amountRef.current?.focus();
  }, []);

  return (
    <Form
      id="add_trx"
      variants={{ padding: "4" }}
      className="max-w-md"
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
        <Category.List
          canAddCategory={canAddCategory}
          categories={categories[transactionType]}
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

              console.log({ selectedCategory, data });

              //ISSUE:
              //if you select new item,
              // and then swiched to already existed one, then
              // data will hold the stale value.
              if (selectedCategory) {
                setCategories((prev) => {
                  const prevCategories = prev[transactionType];
                  const isDuplicate = prevCategories.includes(selectedCategory);
                  // if element already exists, skip appending,
                  // and return the previous state.
                  if (isDuplicate) {
                    return prev;
                  }
                  return {
                    ...prev,
                    [transactionType]: [...prevCategories, selectedCategory],
                  };
                });
                setSelectedId(data.categoryId!);
                setIsOpen(false);
              } else {
                console.log("selected is duplicate!");
                setIsOpen(false);
              }
            }}
            confirmationButton={
              <button
                type="submit"
                form="dialog"
                className="flex justify-center basis-1/3 bg-black text-white py-1 rounded-md"
                // onClick={(e) => e.stopPropagation()}
              >
                {isLoading ? (
                  <Spinner variants={{ intent: "secondary" }} />
                ) : (
                  translation.buttons.add
                )}
              </button>
            }
          >
            <Category.List
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
        <button
          form="add_trx"
          className={`flex justify-center items-center capitalize py-1 basis-1/3 rounded-lg shadow ${
            !canAdd ? "text-gray-300" : ""
          }`}
          type="submit"
          disabled={!canAdd}
        >
          {!status.isLoading && !isLoading ? (
            translation.buttons.add
          ) : (
            <Spinner />
          )}
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
