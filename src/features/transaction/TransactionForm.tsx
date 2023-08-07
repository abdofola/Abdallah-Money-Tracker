import React, { Reducer } from "react";
import DateSelection from "./DateSelection";
import { Form, Modal } from "@components/ui";
import { useRouter } from "next/router";
import { en, ar } from "@locales";
import { Category } from "./index";
import { otherCategories } from "./constants";
import { useAddCategoryMutation, useGetCategoriesQuery } from "@app/services";
import { Transition } from "@components/Transition";
import { useForm, useLocalStorage } from "@lib/helpers/hooks";
import { categories as defaultCategories } from "./constants";
import { TransactionFormProps } from "./types";
import { useAppSelector } from "@app/hooks";
import { CurrencyState, selectCurrentCurrency } from "@features/currency";
import { Icon } from "@components/icons";

type FormData = {
  amount: string;
  categoryId: string;
  date: Date;
  comment?: string;
};
type State = { [k in "inner" | "outer"]: string };
type R = Reducer<State, Partial<State>>;

function TransactionForm({
  user,
  transactionType,
  transactionComment,
  transactionDate,
  categoryId,
  transactionAmount,
  canAddCategory = true,
  btnJSX,
  displayOn,
  mutation,
}: TransactionFormProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [state, dispatchCategory] = React.useReducer<R>(
    (state, newState) => {
      return {
        ...state,
        ...newState,
      };
    },
    {
      inner: "",
      outer: categoryId ?? "",
    }
  );
  const {
    formState,
    register,
    onSubmit: formSubmit,
    reset,
    dispatch,
  } = useForm<FormData>({
    amount: transactionAmount ?? "",
    categoryId: categoryId ?? "",
    date: transactionDate ?? new Date(),
  });
  const currency = useAppSelector(selectCurrentCurrency);
  const [crncLS, _] = useLocalStorage<CurrencyState>("currency", {
    id: "",
    short: "",
    long: "",
  });
  const { data: cateogriesResponse } = useGetCategoriesQuery({
    userId: user.id,
  });
  const [addCategory, { isLoading: isLoadingCatM }] = useAddCategoryMutation();
  const [categoriesLS, setCategoriesLS] = useLocalStorage(
    "categories",
    defaultCategories
  );
  const { locale } = useRouter();
  const translation = locale === "en" ? en : ar;
  const index = categoriesLS[transactionType].findIndex(
    (c) => c.iconId === categoryId
  );
  const handleSubmit = async (data: FormData) => {
    if (!data.categoryId) {
      return;
    }
    const selectedCategory = categoriesLS[transactionType].find((c) => {
      return c.iconId === formState.data.categoryId;
    });
    //console.log({ selectedCategory });
    const matchedSelection = cateogriesResponse?.[transactionType].find(
      (c) => c.iconId === selectedCategory?.iconId
    );
    const { id, ...payload } = selectedCategory!;

    try {
      let catId: string;
      // check to see if user has the selected category or not,
      // to decide whether to add it(i.e perform mutation request).
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
        ...data,
        categoryId: catId,
        currencyId: currency.id || crncLS.id,
        date: formState.data.date,
        amount: (formState.data.amount),
      });
      // console.log({ newTrx });
    } catch (err) {
      console.error({ err });
    } finally {
      reset((values) => ({ ...values, date: new Date(), categoryId: "" }));
      dispatchCategory({ outer: "" });
      displayOn();
    }
  };

  if (categoryId && index < 0) {
    // in case the user emptied the localStorage,
    // add category again.
    const category = otherCategories[transactionType].find(
      (c) => c.iconId === categoryId
    );
    setCategoriesLS((prev) => ({
      ...prev,
      [transactionType]: [...prev[transactionType], category],
    }));
  }

  return (
    <Form
      noValidate
      id="add_trx"
      variants={{ padding: "4" }}
      className="max-w-md"
      onSubmit={formSubmit(handleSubmit)}
    >
      {/* amount */}
      <div className="flex flex-col gap-1">
        <Transition
          isMounted={Boolean(formState.errors.amount)}
          from="scale-y-0"
          to=" scale-y-100"
          className="flex gap-1 origin-bottom-left"
        >
          <Icon
            href="/sprite.svg#exclamation-mark"
            className="w-6 h-6 fill-orange-300"
          />
          <span>{formState.errors.amount}</span>
        </Transition>
        <label htmlFor="amount" className=" text-gray-400">
          {translation.transactionDetails.amount}
        </label>
        <div className="flex gap-2 items-center">
          <input
            className={`
              transition basis-full px-2 py-1 bg-gray-100 shadow-inner rounded-md ring-gray-300 ring-offset-4 
              focus:outline-0 focus:ring-1
              ${formState.errors.amount ? "ring-1 ring-red-600" : ""}
            `}
            {...register("amount", {
              type: "number",
              min: 0,
              id: "amount",
              step: "0.01",
              required: true,
              isControlled: true,
            })}
          />
          <span>{translation.transactionDetails.currency}</span>
        </div>
      </div>
      {/* categories */}
      <div className="flex flex-col gap-1">
        <Transition
          isMounted={Boolean(formState.errors.categoryId)}
          from="scale-y-0"
          to=" scale-y-100"
          className="flex gap-1 origin-bottom-left"
        >
          <Icon
            href="/sprite.svg#exclamation-mark"
            className="w-6 h-6 fill-orange-300"
          />
          <span>{formState.errors.categoryId}</span>
        </Transition>

        <span className="text-gray-400">
          {translation.transactionDetails.category}
        </span>
        <Category.List
          canAddCategory={canAddCategory}
          categories={categoriesLS[transactionType]}
          selectedId={state.outer}
          setSelectedId={(id) => dispatchCategory({ outer: id })}
          open={() => setIsOpen(true)}
          renderCategory={(props) => <Category key={props.cat.id} {...props} />}
          register={register}
        />
        <Transition isMounted={isOpen}>
          <Modal
            className="items-end"
            isMounted={isOpen}
            headerTxt={translation.headings.addCategory}
            close={() => setIsOpen(false)}
            onConfirm={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const controls = e.currentTarget.elements;
              const selectedCategoryNode = controls.namedItem(
                "categoryId"
              ) as RadioNodeList;
              const selectedCategory = otherCategories[transactionType].find(
                (c) => c.iconId === selectedCategoryNode.value
              );

              if (!selectedCategory) {
                setIsOpen(false);
                return;
              }

              const isDuplicate = categoriesLS[transactionType].find(
                (c) => c.iconId === selectedCategory.iconId
              );

              if (isDuplicate == null) {
                // in case `selectedCategory` doesn't exists in localStorage,
                setCategoriesLS((prev) => {
                  return {
                    ...prev,
                    [transactionType]: [
                      ...prev[transactionType],
                      selectedCategory,
                    ],
                  };
                });
              }

              dispatch({
                type: "data",
                payload: { categoryId: selectedCategoryNode.value },
              });
              dispatchCategory({
                outer: selectedCategoryNode.value,
                inner: "",
              });

              //close modal
              setIsOpen(false);
            }}
            confirmationButton={
              <button
                type="submit"
                form="dialog"
                className="grid items-center basis-1/3 h-10 shadow-3D rounded-md"
              >
                {translation.buttons.add}
              </button>
            }
          >
            <Category.List
              categories={otherCategories[transactionType]}
              selectedId={state.inner}
              setSelectedId={(id) => dispatchCategory({ inner: id })}
              register={register}
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
          startDate={formState.data.date}
          onChange={(date) =>
            dispatch({ type: "data", payload: { date: date as Date } })
          }
        />
      </div>
      {/* comment */}
      <div className="flex flex-col gap-1">
        <label htmlFor="comment" className="text-gray-400">
          {translation.transactionDetails.comment}
        </label>
        <textarea
          {...register("comment", {
            id: "comment",
            defaultValue: transactionComment as string,
            className:
              "transition px-2 py-px bg-gray-100 shadow-inner rounded-md resize-none focus:outline-0 ring-offset-4 focus:ring-1 focus:ring-gray-300",
            ref(elem) {
              // if it's rendered with content, make the height equals to the content.
              if (elem) elem.style.height = elem.scrollHeight + "px";
            },
            onChange(e) {
              const { style } = e.target;
              // the next 2 lines for increasing & decreasing the height of the `textarea` dynamically.
              style.height = "inherit";
              style.height = e.target.scrollHeight + "px";
            },
          })}
        />
      </div>
      {/* buttons */}
      <menu className="flex gap-2">
        {btnJSX({ isLoading: isLoadingCatM })}
        <button
          type="reset"
          className="text-gray-400"
          onClick={() => {
            reset((values) => ({
              ...values,
              date: new Date(),
            }));
            dispatchCategory({ outer: "" });
          }}
        >
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
