import dynamic from "next/dynamic";
import React from "react";
import { Tab } from "@components/Tab";
import { Money } from "@components/icons";
import { DisplayAmount, Display, AddTransaction } from "@features/transaction";
import { TransactionProps } from "@features/transaction/types";
import { DateProvider } from "@components/contexts";
import { transactionTypes, periods } from "@features/transaction/constants";


// COMPONENT
const Transaction: React.FC<TransactionProps> = ({ data }) => {
  const [transactionIdx, setTransaction] = React.useState(1);
  const [periodIdx, setPeriod] = React.useState(0);
  const [display, setDisplay] = React.useState(true);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const total = data[transactionTypes[transactionIdx]["txt"]].reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  const dates = { startDate, endDate, setStartDate, setEndDate };
  const selectedPeriod = periods[periodIdx]["txt"];
  const Panels = transactionTypes.map((t) => (
    <Tab.Panel key={t.id}>
      <DateProvider data={data[t.txt]} {...dates}>
        {display ? (
          <Display
            transactionType={t.txt}
            periodIndex={periodIdx}
            setPeriod={setPeriod}
            displayOff={() => setDisplay(false)}
          />
        ) : (
          <AddTransaction
            transactionType={t.txt}
            displayOn={() => setDisplay(true)}
          />
        )}
      </DateProvider>
    </Tab.Panel>
  ));

  console.log({Panels})
  //prevent selecting multiple dates from date-picker when `period` tab not selected.
  if (selectedPeriod !== "period" && endDate) {
    setEndDate(null);
  }

  return (
    <div className="flex flex-col items-center gap-4 max-w-[95%] w-[25rem] mx-auto">
      <div className="flex items-end">
        <Money className="w-5 h-5" stroke="rgb(0 0 0/0.3)" />
        <DisplayAmount
          amount={total}
          className="mr-3 font-serif font-medium text-gray-700"
        />
        <span className="text-gray-400">total</span>
      </div>

      <Tab.Group
        className="self-stretch"
        defaultTab={transactionIdx}
        onChange={setTransaction}
      >
        <Tab.List
          tabs={transactionTypes}
          className="flex justify-center items-center gap-10 before:bg-gray-600"
          renderTab={({ tab, isSelected }) => (
            <Tab
              key={tab.id}
              tab={tab}
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
