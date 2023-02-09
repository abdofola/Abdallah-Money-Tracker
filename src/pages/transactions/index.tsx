import React from "react";
import { NextPageWithLayout } from "./_app";
import { withSessionSsr } from "@lib/session";
import { useGetTransactionsQuery } from "@app/services/api";
import { Layout } from "@components/Layout";
import { useAppDispatch } from "@app/hooks";
import { useAuth } from "@lib/helpers/hooks";
import { setCredentials } from "@features/auth";
import { TransactionItem, TransactionList } from "@features/transaction";
import { Spinner } from "@components/ui";
import { Tab } from "@components/Tab";
import { transactionTypes } from "@features/transaction/constants";
import styles from "./transactions.module.css";

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const { user } = req.session;

  console.log("-----getServerSideProps---->", { session: user });
  if (!user) return { redirect: { permanent: false, destination: "/login" } };
  return { props: { session: user } };
});

// component
const AccountStatement: NextPageWithLayout = ({ session }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { data, isSuccess, isLoading, isFetching, isError, error } =
    useGetTransactionsQuery({ userId: session.id });
  let transactions = { income: new Map(), expenses: new Map() };

  if (!user) {
    // set the user to the current session.
    dispatch(setCredentials(session));
  }
  if (error) {
    console.error("fetching transactions error", error);
  }
  if (isSuccess) {
    // transform data into object literal
    for (let t of data.transactions) {
      const itemMap = transactions[t.category.type];
      if (!itemMap.has(t.date)) itemMap.set(t.date, []);
      itemMap.get(t.date).push(t);
    }
  }
  const Panels = transactionTypes.map((t) => {
    return (
      <Tab.Panel key={t.id} className="space-y-2">
        {isLoading && <Spinner variants={{ width: "lg" }} />}
        {transactions[t.txt].size === 0 ? (
          <p>no {t.txt} yet!</p>
        ) : (
          [...transactions[t.txt]].map(([date, trans]) => {
            return (
              <React.Fragment key={date}>
                <h4 className={styles.fullBleed}>{date}</h4>
                <TransactionList
                  className="space-y-2"
                  data={trans}
                  renderItem={(t) => {
                    return <TransactionItem withComment key={t.id} item={t} />;
                  }}
                />
              </React.Fragment>
            );
          })
        )}
      </Tab.Panel>
    );
  });

  return (
    <Tab.Group className="w-[35rem] max-w-full mx-auto">
      <Tab.List
        tabs={transactionTypes}
        className="flex justify-center items-center gap-10 mb-4 before:bg-gray-600"
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
  );
};

// page layout
AccountStatement.Layout = function getLayout(page) {
  return (
    <Layout withHeader title="transactions" className="px-2 py-4">
      {page}
    </Layout>
  );
};

export default AccountStatement;

new Map([]).entries();
