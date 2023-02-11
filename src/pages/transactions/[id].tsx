import React from "react";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import { withSessionSsr } from "@lib/session";
import { Layout } from "@components/Layout";
import { useAuth, useGetHeight } from "@lib/helpers/hooks";
import { Spinner } from "@components/ui";
import { useGetTransactionQuery } from "@app/services/api";
import { TransactionForm } from "@features/transaction";
import { DateProvider } from "@components/contexts";

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const { user } = req.session;

  console.log("-----getServerSideProps---->", { session: user });
  if (!user) return { redirect: { permanent: false, destination: "/login" } };
  return { props: { session: user } };
});

const Transaction: NextPageWithLayout = ({ session }) => {
  const { query } = useRouter();
  const [display, setDisplay] = React.useState(true);
  const { data = { transaction: {} } } = useGetTransactionQuery({
    id: query.id,
    userId: session.id,
  });
  const navHeight = useGetHeight("#nav");
  const loginHeight = useGetHeight("#navLogin");
  const { amount, date, category, comment } = data.transaction;

  /**
   * TODO:
   * 1- api call to get the transaction of this id ✅
   * 2- display the transaction, with options to mutate(update or delete)✅
   * 3- onclick `update` button display `TransactionForm` with the corresponding data.✅
   * 4- after updating the field send `update request` and forward to ??
   * 5- onclick `delete` button display a `Modal` with two options to confirm or cancel
   */
  return (
    <main
      style={{ paddingTop: loginHeight + 10, paddingBottom: navHeight + 20 }}
    >
      {display ? (
        <DisplayDetails
          details={{ amount, date, category, comment }}
          displayOff={() => setDisplay(false)}
        />
      ) : (
        <DateProvider>
          <TransactionForm
            user={session}
            displayOn={() => setDisplay(true)}
            transactionType={category.type}
            transactionAmount={amount}
            categoryId={category.id}
            transactionComment={comment}
            transactionDate={new Date(date)}
          />
        </DateProvider>
      )}
    </main>
  );
};

// page layout
Transaction.Layout = function getLayout(page) {
  return (
    <Layout withHeader title="transaction" className="px-2 py-4">
      {page}
    </Layout>
  );
};

function DisplayDetails({ details, displayOff }) {
  const { amount, category, date, comment } = details;
  return (
    <div className="grid gap-4 px-2">
      <header className="capitalize">
        <h2>
          <strong className="relative z-10 font-medium text-gray-700 before:absolute before:-z-10 before:left-0 before:bottom-0 before:w-full before:h-2 before:bg-gradient-to-tr from-pink-200 to-blue-100 ">transaction details</strong>
        </h2>
      </header>
      <dl className="flex flex-col gap-1">
        <div>
          <dt className="text-gray-400">amount</dt>
          <dd>{amount} </dd>
        </div>
        <div>
          <dt className="text-gray-400">category</dt>
          <dd>{category?.name} </dd>
        </div>
        <div>
          <dt className="text-gray-400">date</dt>
          <dd>{date}</dd>
        </div>
        {comment && (
          <div>
            <dt className="text-gray-400">comment</dt>
            <dd>{comment}</dd>
          </div>
        )}
      </dl>
      <div className="flex gap-4">
        <button
          type="button"
          className="px-4 py-1 shadow rounded-md"
          onClick={displayOff}
        >
          update
        </button>
        <button type="button">delete</button>
      </div>
    </div>
  );
}

export default Transaction;
