import React from "react";
import { DisplayProps, FilterTransactions, PeriodType } from "@features/transaction/types";
import { Tab } from "@components/Tab";
import {
  TransactionList,
  TransactionItem,
  DateSelection,
} from "@features/transaction";
import { Donut } from "@components/Chart";
import { Plus } from "@components/icons";
import { useDate } from "@components/contexts";
import { myDate } from "@lib/utils";
import { periods } from "./constants";
import { TransactionElement } from "@features/transaction/types";

const isInselectedTime = (
  selectedTime: PeriodType,
  transactionDate: Date,
  selectedDate: { start: Date; end?: Date }
): boolean => {
  const { filter } = myDate;
  const { start, end } = selectedDate;
  return {
    day: filter.inThisDateDay,
    week: filter.inThisDateWeek,
    month: filter.inThisDateMonth,
    year: filter.inThisDateYear,
    period: filter.inThisDatePeriod,
  }[selectedTime](transactionDate, start, end);
};
const filterTransactions: FilterTransactions = ({
  data,
  periodType,
  selectedDate,
}) => {
  const filteredByDate = data.filter((t) => {
    return isInselectedTime(periodType, new Date(t.date), selectedDate);
  });

  return filteredByDate;
};
const donutInnerText = (
  period: string,
  transaction: string,
  total: number = 0
) => {
  let text = "There were no ";
  if (total) return total.toFixed(2).toString().concat(" SDG");
  if (period === "day") text += `${transaction} today`;
  else text += `${transaction} in this ${period}`;
  return text;
};
const calculatePercentage = (amount: number, total: number) =>
  Math.round((amount / total) * 100);

//COMPONENT
const Display: React.FC<DisplayProps> = ({
  periodIndex,
  setPeriod,
  transactionType,
  displayOff,
}) => {
  const periodRef = React.useRef<HTMLButtonElement | null>(null);
  const { data, startDate: start, endDate: end } = useDate();
  const [filteredTransactions, setFilteredTransactions] = React.useState(() => {
    return filterTransactions({
      data,
      periodType: periods[periodIndex]["txt"],
      selectedDate: { start, end },
    });
  });
  const mergedDuplicateData = React.useMemo(() => {
    const duplicates: { [k: string]: TransactionElement[] } = {};
    const merged: TransactionElement[] = [];

    // if there's only one item, then just return the array.
    if (filteredTransactions.length < 2) return filteredTransactions;

    for (let i = 0; i < filteredTransactions.length; i++) {
      const trans = filteredTransactions[i];
      const { category: elem } = trans;

      if (!(elem.id in duplicates)) duplicates[elem.id] = [];
      //don't check the same element against duplication twice.
      if (duplicates[elem.id].length > 1) continue;

      for (let j = i + 1; j < filteredTransactions.length; j++) {
        const { category: nextElem } = filteredTransactions[j];
        if (elem.id === nextElem.id) {
          duplicates[elem.id].push(filteredTransactions[j]);
        }
      }

      duplicates[elem.id].push(trans);
    }

    for (let key in duplicates) {
      const amountSum = duplicates[key].reduce(
        (acc, curr) => acc + curr.amount,
        0
      );
      merged.push({
        ...duplicates[key][0],
        amount: amountSum,
        value: amountSum,
      });
    }

    return merged;
  }, [filteredTransactions]);
  const selectedPeriod = periods[periodIndex]["txt"];
  const total = filteredTransactions.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );
  const Panels = periods.map((p) => {
    return (
      <Tab.Panel key={p.id}>
        <Donut
          data={mergedDuplicateData}
          donutInnerLabel={donutInnerText(
            selectedPeriod,
            transactionType,
            total
          )}
        />
      </Tab.Panel>
    );
  });

  return (
    <div className="flex flex-col gap-4 mt-4">
      <Tab.Group
        className="w-full p-2 bg-white rounded-lg border border-gray-100"
        defaultTab={periodIndex}
        onChange={(selectedIdx: number) => {
          const selected = periods[selectedIdx]["txt"];
          setPeriod(selectedIdx);
          if (selected === "period") return; // prevent setting data immediately when tab `period` selected
          setFilteredTransactions(
            filterTransactions({
              data,
              periodType: selected,
              selectedDate: { start },
            })
          );
        }}
      >
        <Tab.List
          tabs={periods}
          className="flex justify-center gap-4 font-medium overflow-hidden before:bg-gray-600"
          renderTab={({ tab, isSelected }) => (
            <Tab
              key={tab.id}
              tab={tab}
              periodRef={periodRef}
              className={`capitalize ${
                isSelected ? "text-gray-700" : " text-gray-300"
              }`}
            />
          )}
        />
        <Tab.Panels className="relative p-4">
          <DateSelection
            periodRef={periodRef}
            className="flex mx-auto mb-8 text-sm font-medium border-b border-gray-400"
            selection={selectedPeriod}
            filter={({ start, end }) =>
              setFilteredTransactions(
                filterTransactions({
                  data,
                  periodType: selectedPeriod,
                  selectedDate: { start, end },
                })
              )
            }
          />
          {Panels}
          <button
            className="absolute p-2 border rounded-full bottom-2 right-2"
            onClick={displayOff}
          >
            <Plus />
          </button>
        </Tab.Panels>
      </Tab.Group>
      <TransactionList
        className="hideScrollBar relative w-full space-y-2 max-h-72 rounded-lg overflow-y-scroll"
        data={mergedDuplicateData}
        renderItem={(item) => {
          const percentage = calculatePercentage(item.amount, total);
          return (
            <TransactionItem
              key={item.id}
              item={item}
              percentage={percentage.toString().concat("%")}
            />
          );
        }}
      />
    </div>
  );
};

export { Display as default, filterTransactions };
