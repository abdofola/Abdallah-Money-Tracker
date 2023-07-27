import React from "react";
import Link from "next/link";
import { NextPageWithLayout } from "../_app";
import { withSessionSsr } from "@lib/session";
import { useGetTransactionsQuery } from "@app/services";
import { Layout } from "@components/Layout";
import {
  useGetHeight,
  useLocalStorage,
  useWindowResize,
} from "@lib/helpers/hooks";
import { TransactionItem, TransactionList } from "@features/transaction";
import { EmptyState, Spinner } from "@components/ui";
import { Tab } from "@components/Tab";
import { transactionTypes } from "@features/transaction/constants";
import { useRouter } from "next/router";
import { en, ar } from "@locales";
import { Transition } from "@components/Transition";
import styles from "./transactions.module.css";
import { CurrencyState, selectCurrentCurrency } from "@features/currency";
import { useAppSelector } from "@app/hooks";
import { TransactionElement } from "@features/transaction/types";
import { User } from "@prisma/client";

type TrxByDate = {
  [k in "income" | "expenses"]: Map<Date, TransactionElement[]>;
};
type P = { session: User };

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const { user } = req.session;

  if (!user) return { redirect: { permanent: false, destination: "/login" } };

  return { props: { session: user } };
});

//TODO: 
// add filter feat. to get the trxs asc or desc by date.
// component
const AccountStatement: NextPageWithLayout<P> = ({ session }) => {
  const { query, locale } = useRouter();
  const windowWidth = useWindowResize();
  const navHeight = useGetHeight("#nav");
  const loginHeight = useGetHeight("#navLogin");
  const currency = useAppSelector(selectCurrentCurrency);
  const [crncLS, _] = useLocalStorage<CurrencyState>("currency", {
    id: "",
    short: "",
    long: "",
  });
  const { data, isLoading, isFetching } = useGetTransactionsQuery({
    categoryId: query.categoryId as string,
    currencyId: currency.id || crncLS.id,
    userId: session.id,
  });
  const memoizedTrxsByDate = React.useMemo<TrxByDate>(() => {
    const trxsByDate: TrxByDate = { income: new Map(), expenses: new Map() };
    if (data) {
      // map data into `date` as key, and value is array of `@type Transaciton` that corresponds to this date.
      for (let t of data.transactions) {
        const item = trxsByDate[t.category.type!];
        if (!item.get(t.date)) item.set(t.date, []);
        item.get(t.date).push(t);
      }
    }
    return trxsByDate;
  }, [data]);
  const translation = locale === "en" ? en : ar;
  const tabIdx = transactionTypes.findIndex((t) => t.txt.en === query.type);
  const smScreen = 640;
  const Panels = transactionTypes.map((t) => {
    return (
      <Tab.Panel key={t.id} className="grid place-items-center">
        <Transition isMounted={isLoading}>
          <Spinner variants={{ width: "lg" }} />
        </Transition>
        {memoizedTrxsByDate[t.txt.en].size === 0 && !isLoading ? (
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
          Array.from(memoizedTrxsByDate[t.txt.en]).map(([date, trans]) => {
            return (
              <div key={date.toString()} className="w-full">
                <h4
                  className={styles.fullBleed}
                  style={{ top: loginHeight + "px" }}
                >
                  {date.toString()}
                </h4>
                <TransactionList
                  className="flex flex-col gap-2"
                  data={trans}
                  renderItem={(t) => {
                    return (
                      <Transition
                        key={t.id}
                        isMounted
                        from="opacity-0 -translate-y-10"
                        to="opacity-100 translate-y-0"
                      >
                        <TransactionItem
                          withComment
                          href={{
                            pathname: "/transactions/[id]",
                            query: { id: t.id },
                          }}
                          item={t}
                        />
                      </Transition>
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

//  console.log({isFetching})
  return (
    <div
      style={{
        paddingTop: windowWidth >= smScreen ? navHeight : loginHeight,
        paddingBottom: navHeight,
      }}
    >
      <Tab.Group
        className=" w-[35rem] max-w-full mx-auto leading-loose"
        defaultTab={tabIdx < 0 ? 1 : tabIdx}
      >
        <Tab.List
          tabs={transactionTypes}
          className="flex justify-center items-center gap-10 mb-4"
          renderTab={({ tab, isSelected }) => (
            <Tab
              key={tab.id}
              tab={{ id: tab.id, txt: tab.txt[locale as "ar" | "en"] }}
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
      className="px-2 py-8"
      session={page.props.session}
    >
      {page}
    </Layout>
  );
};

export default AccountStatement;
