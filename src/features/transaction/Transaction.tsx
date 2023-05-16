import React from "react";
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
} from "@app/services/api";
import { useRouter } from "next/router";
import { ar, en } from "@locales";
import { Spinner } from "@components/ui";
import { Transition } from "@components/Transition";

// dynamic imports,
// to defer loading component until it's first rendered,
// then subsequent renders will be cached.
const Display = dynamic(() =>
  import("@features/transaction").then(({ Display }) => Display)
);
const TransactionForm = dynamic(() =>
  import("@features/transaction").then(({ TransactionForm }) => TransactionForm)
);

//TODO:
//1- Add user profile, to change currency, and generate sort of avatar from it's email.
//2-
// COMPONENT
const Transaction: React.FC<TransactionProps> = ({ user }) => {
  const { locale } = useRouter();
  const [transactionIdx, setTransaction] = React.useState(1);
  const [periodIdx, setPeriod] = React.useState(0);
  const {
    data = { transactions: [] },
    isLoading: isLoadingTrxs,
    isFetching,
  } = useGetTransactionsQuery({
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
  const [dates, dispatch] = React.useReducer(
    (state, newState) => {
      return { ...state, ...newState };
    },
    { startDate: new Date(), endDate: null }
  );
  const [addTransaction, { isLoading }] = useAddTransactionMutation();
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
        <React.Suspense fallback={<Spinner variants={{ width: "md" }} />}>
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
              status={{ isLoading }}
            />
          </Transition>
        </React.Suspense>
      </DataProvider>
    </Tab.Panel>
  ));

  //prevent selecting multiple dates from date-picker when `period` tab not selected.
  if (selectedPeriod !== "period" && endDate) {
    dispatch({ startDate, endDate: null });
  }

  return (
    <div className="flex flex-col items-center gap-4 max-w-[95%] w-[50rem] mx-auto">
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
          className="flex justify-center items-center gap-10"
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
