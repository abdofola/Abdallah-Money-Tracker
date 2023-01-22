import React from "react";
import { NextPageWithLayout } from "../_app";
import { Chart } from "@components/Chart";
import { Layout } from "@components/Layout";
import { Transacitons } from "@components/Transactions";
import { useData } from "@components/contexts";
import { transactionTypes } from "@lib/constants";

const RecordsSummary: NextPageWithLayout = () => {
  const {
    state: { filter },
  } = useData();
  const { active, ...data } = filter;

  const [_, filteredData] = Object.entries(data).find(
    ([key, _]) => key === active
  ) as [string, typeof filter["today"]]; // returns the first matching Iterator (of [key, value] pair).

  const incomes = filteredData.filter(
    (t) => t.type === transactionTypes.income
  );
  const expenses = filteredData.filter(
    (t) => t.type === transactionTypes.expense
  );
  const emptyIncomes = incomes.length == 0;
  const emptyExpenses = expenses.length == 0;

  return (
    <main className="grid grid-cols-2 justify-center my-[10vh] md:flex">
      <div className="col-span-2 row-start-1 grow-0 shrink-0 basis-2/5">
        <Transacitons data={data} filter={active}>
          <Transacitons.Tabs />
          <Transacitons.Panel />
        </Transacitons>
      </div>

      {!emptyExpenses && (
        <div className={`basis-1/4 -order-1 ${emptyIncomes && "col-span-2"}`}>
          <Chart key="expense" name="expense" transactions={expenses} />
        </div>
      )}

      {!emptyIncomes && (
        <div className={`basis-1/4 ${emptyExpenses && "col-span-2"}`}>
          <Chart key="income" name="income" transactions={incomes} />
        </div>
      )}
    </main>
  );
};

RecordsSummary.Layout = function getLayout(page) {
  return (
    <Layout title="summary" className="">
      {page}
    </Layout>
  );
};

export default RecordsSummary;
