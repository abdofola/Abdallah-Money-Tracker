import React from "react";
import Link from "next/link";
import { NextPageWithLayout } from "../_app";
import { withSessionSsr } from "@lib/session";
import { useGetTransactionsQuery } from "@app/services/api";
import { Layout } from "@components/Layout";
import { useGetHeight } from "@lib/helpers/hooks";
import { TransactionItem, TransactionList } from "@features/transaction";
import { EmptyState, Spinner } from "@components/ui";
import { Tab } from "@components/Tab";
import { transactionTypes } from "@features/transaction/constants";
import { useRouter } from "next/router";
import { en, ar } from "@locales";
import styles from "./transactions.module.css";

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const { user } = req.session;

  console.log("-----getServerSideProps---->", { session: user });
  if (!user) return { redirect: { permanent: false, destination: "/login" } };
  return { props: { session: user } };
});

// component
const AccountStatement: NextPageWithLayout = ({ session }) => {
  const { query, locale } = useRouter();
  const navHeight = useGetHeight("#nav");
  const loginHeight = useGetHeight("#navLogin");
  const { data, isSuccess, isLoading, error, endpointName } =
    useGetTransactionsQuery({
      category: query.category as string,
      userId: session.id,
    });
  const tabIdx = transactionTypes.findIndex((t) => t.txt.en === query.type);
  let transactions = { income: new Map(), expenses: new Map() };

  if (error) {
    console.error("fetching transactions error", error);
  }
  if (isSuccess) {
    // map data into `date` as key, value as array of `transaciton` that corresponds to this date.
    for (let t of data.transactions) {
      const itemMap = transactions[t.category.type];
      if (!itemMap.has(t.date)) itemMap.set(t.date, []);
      itemMap.get(t.date).push(t);
    }
  }
  const translation = locale === "en" ? en : ar;

  const Panels = transactionTypes.map((t) => {
    return (
      <Tab.Panel key={t.id} className="grid place-items-center">
        {isLoading && <Spinner variants={{ width: "lg" }} />}
        {transactions[t.txt.en].size === 0 && !isLoading ? (
          /** -------empty state----- */
          <EmptyState
            className="flex flex-col items-center self-center max-w-[90%]"
            icon="/sprite.svg#search"
            renderParagraph={() => (
              <p className="text-gray-400 text-center text-sm">
                {translation.messages.emptyState.p3}
                <Link
                  shallow
                  href={{
                    pathname: "/transactions",
                  }}
                >
                  <a className="ltr:ml-1 rtl:mr-1 underline">
                    {translation.messages.emptyState.p4}
                  </a>
                </Link>
              </p>
            )}
          />
        ) : (
          /** -------transaction records grouped by date----- */
          [...transactions[t.txt.en]].map(([date, trans]) => {
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

  // console.log({ session });

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
          className="flex justify-center items-center gap-10 mb-4"
          renderTab={({ tab, isSelected }) => (
            <Tab
              key={tab.id}
              tab={{ id: tab.id, txt: tab.txt[locale] }}
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
    <Layout
      withHeader
      title="transactions"
      className="px-2 py-4"
      session={page.props.session}
    >
      {page}
    </Layout>
  );
};

export default AccountStatement;
