import React from "react";
import { NextPageWithLayout } from "./_app";
import { withSessionSsr } from "@lib/session";
import { useGetTransactionsQuery } from "@app/services/api";
import { Layout } from "@components/Layout";
import { useAppDispatch } from "@app/hooks";
import { useAuth, useGetHeight } from "@lib/helpers/hooks";
import { setCredentials } from "@features/auth";
import { TransactionItem, TransactionList } from "@features/transaction";
import { Spinner } from "@components/ui";
import { Tab } from "@components/Tab";
import { transactionTypes } from "@features/transaction/constants";
import styles from "./transactions.module.css";
import { useRouter } from "next/router";
import Link from "next/link";

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
  const { query } = useRouter();
  const navHeight = useGetHeight("#nav");
  const loginHeight = useGetHeight("#navLogin");
  const { data, isSuccess, isLoading, error } = useGetTransactionsQuery({
    category: query.category as string,
    userId: session.id,
  });
  const tabIdx = transactionTypes.findIndex((t) => t.txt === query.type);
  let transactions = { income: new Map(), expenses: new Map() };

  if (!user) {
    // set the user to the current session.
    dispatch(setCredentials(session));
  }
  if (error) {
    console.error("fetching transactions error", error);
  }
  if (isSuccess) {
    // map data into key as date, value as array of data that corresponds to this date.
    for (let t of data.transactions) {
      const itemMap = transactions[t.category.type];
      if (!itemMap.has(t.date)) itemMap.set(t.date, []);
      itemMap.get(t.date).push(t);
    }
  }
  const Panels = transactionTypes.map((t) => {
    return (
      <Tab.Panel key={t.id} className="grid place-items-center">
        {isLoading && <Spinner variants={{ width: "lg" }} />}
        {transactions[t.txt].size === 0 ? (
          <p>no {t.txt} yet!</p>
        ) : (
          [...transactions[t.txt]].map(([date, trans]) => {
            return (
              <div key={date} className="w-full">
                <h4
                  className={styles.fullBleed}
                  style={{ top: loginHeight + "px" }}
                >
                  {date}
                </h4>
                <TransactionList
                  className="flex flex-col gap-2"
                  data={trans}
                  renderItem={(t) => {
                    return (
                      <TransactionItem
                        withComment
                        key={t.id}
                        href={{
                          pathname: "/transactions/[id]",
                          query: { id: t.id },
                        }}
                        item={t}
                      />
                    );
                  }}
                />
              </div>
            );
          })
        )}
      </Tab.Panel>
    );
  });

  return (
    <div
      style={{ paddingTop: loginHeight + 10, paddingBottom: navHeight + 20 }}
    >
      <Tab.Group
        className="w-[35rem] max-w-full mx-auto"
        defaultTab={tabIdx < 0 ? 0 : tabIdx}
      >
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
        <Tab.Panels className="w-full">{Panels}</Tab.Panels>
      </Tab.Group>
    </div>
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

function Records({ date, data, loginHeight }) {
  return (
    <div>
      <h4 className={styles.fullBleed} style={{ top: loginHeight + "px" }}>
        {date}
      </h4>
      <TransactionList
        className="flex flex-col gap-2"
        data={data}
        renderItem={(t) => {
          return <TransactionItem key={t.id} withComment item={t} />;
        }}
      />
    </div>
  );
}

export default AccountStatement;
