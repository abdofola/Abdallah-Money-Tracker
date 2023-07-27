import React, { Reducer } from "react";
import dynamic from "next/dynamic";
import { Tab } from "@components/Tab";
import { Money } from "@components/icons";
import { DisplayAmount } from "@features/transaction";
import {
  TransactionElement,
  TransactionProps,
  Transform,
} from "@features/transaction/types";
import { DataProvider } from "@components/contexts";
import { transactionTypes, periods } from "@features/transaction/constants";
import {
  useAddTransactionMutation,
  useGetTransactionsQuery,
} from "@app/services";
import { useRouter } from "next/router";
import { ar, en } from "@locales";
import { Spinner } from "@components/ui";
import { Transition } from "@components/Transition";
import { useLocalStorage } from "@lib/helpers/hooks";
import { CurrencyState, selectCurrentCurrency } from "@features/currency";
import { useAppSelector } from "@app/hooks";

type S = { startDate: Date; endDate: Date | null };
type R = Reducer<S, S>;
// dynamic imports,
// to defer loading component until it's first rendered,
// then subsequent renders will be cached.
const Display = dynamic(() =>
  import("@features/transaction").then(({ Display }) => Display)
);
const TransactionForm = dynamic(() =>
  import("@features/transaction").then(({ TransactionForm }) => TransactionForm)
);

//TODO: worst-case scenario when user clear the local storage,
// how to get the selected the currency id ?
// COMPONENT
const Transaction: React.FC<TransactionProps> = ({ user }) => {
  const { locale } = useRouter();
  const [transactionIdx, setTransaction] = React.useState(1);
  const [periodIdx, setPeriod] = React.useState(0);
  const currency = useAppSelector(selectCurrentCurrency);
  const [crncLS, _] = useLocalStorage<CurrencyState>("currency", {
    id: "",
    short: "",
    long: "",
  });
  const {
    data = { transactions: [] },
    isLoading: isLoadingTrxs,
    isFetching,
  } = useGetTransactionsQuery({
    currencyId: currency.id || crncLS.id,
    userId: user.id,
  });
  const transactions = React.useMemo(() => {
    const trans: Transform<TransactionElement> = { income: [], expenses: [] };
    for (let t of data.transactions) {
      trans[t.category.type].push({
        ...t,
        key: t.id,
        color: t.category.color,
        value: t.amount,
      });
    }
    return trans;
  }, [data.transactions]);
  const [display, setDisplay] = React.useState(true);
  const [dates, dispatch] = React.useReducer<R>(
    (state, newState) => {
      return { ...state, ...newState };
    },
    { startDate: new Date(), endDate: null }
  );
  const [addTransaction, { isLoading: isLoadingTrxM }] =
    useAddTransactionMutation();
  const selectedTransaction = transactionTypes[transactionIdx].txt.en;
  const selectedPeriod = periods[periodIdx].txt.en;
  const total = transactions[selectedTransaction].reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  const { startDate, endDate } = dates;
  const translation = locale === "en" ? en : ar;
  const from =
    "overflow-hidden opacity-0 ltr:-translate-x-full rtl:translate-x-full sm:ltr:transform-none sm:rtl:transform-none";
  const to =
    "overflow-hidden opacity-100 ltr:translate-x-0 rtl:translate-x-0 ltr:transform-none rtl:transform-none";
  const Panels = transactionTypes.map((t) => (
    <Tab.Panel key={t.id}>
      <DataProvider
        data={transactions[t.txt.en]}
        dispatch={dispatch}
        {...dates}
      >
        <Transition isMounted={display} from={from} to={to}>
          <Display
            isLoading={isLoadingTrxs}
            isFetching={isFetching}
            transactionType={t.txt}
            periodIndex={periodIdx}
            setPeriod={setPeriod}
            displayOff={() => setDisplay(false)}
          />
        </Transition>
        <Transition isMounted={!display} from={from} to={to}>
          <TransactionForm
            user={user}
            transactionType={t.txt.en}
            displayOn={() => setDisplay(true)}
            mutation={(data: any) => {
              return addTransaction({
                ...data,
                userId: user.id,
              }).unwrap();
            }}
            btnJSX={({ isLoading }) => (
              <button
                form="add_trx"
                className="flex justify-center items-center basis-1/3 h-10 capitalize  rounded-lg shadow-3D"
                type="submit"
              >
                {!isLoading && !isLoadingTrxM ? (
                  translation.buttons.add
                ) : (
                  <Spinner />
                )}
              </button>
            )}
          />
        </Transition>
      </DataProvider>
    </Tab.Panel>
  ));

  //prevent selecting multiple dates from date-picker when `period` tab not selected.
  if (selectedPeriod !== "period" && endDate) {
    dispatch({ startDate, endDate: null });
  }

  //TODO: size of chart component on large screen is pretty ugly.

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-5xl px-2 mx-auto my-8 sm:text-xl">
      <div className="flex items-end">
        <Money className="w-5 h-5 self-center stroke-gray-400" />
        {isLoadingTrxs ? (
          <Spinner
            variants={{ width: "xs" }}
            className="self-center ltr:mr-3 rtl:ml-3"
          />
        ) : (
          <DisplayAmount
            amount={total}
            className=" font-medium text-gray-700 ltr:mr-3 rtl:ml-3"
          />
        )}

        <span className="text-gray-400">{translation.total}</span>
      </div>
      <Tab.Group
        className="self-stretch"
        defaultTab={transactionIdx}
        onChange={setTransaction}
      >
        <Tab.List
          tabs={transactionTypes}
          className="flex justify-center items-center leading-loose gap-10"
          renderTab={({ tab, isSelected }) => (
            <Tab
              key={tab.id}
              tab={{ id: tab.id, txt: tab.txt[locale as "en" | "ar"] }}
              className={`uppercase font-medium ${
                isSelected ? "text-gray-700" : " text-gray-300"
              }`}
            />
          )}
        />
        <Tab.Panels>{Panels}</Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Transaction;
