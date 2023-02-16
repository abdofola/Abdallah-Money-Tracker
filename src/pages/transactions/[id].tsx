import React from "react";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import { withSessionSsr } from "@lib/session";
import { Layout } from "@components/Layout";
import { useAuth, useGetHeight } from "@lib/helpers/hooks";
import { Modal, Spinner } from "@components/ui";
import {
  useDeleteTransactionMutation,
  useGetTransactionQuery,
  useUpdateTransactionMutation,
} from "@app/services/api";
import { TransactionForm } from "@features/transaction";
import { DataProvider } from "@components/contexts";
import { Transaction } from "@prisma/client";

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const { user } = req.session;

  console.log("-----getServerSideProps---->", { session: user });
  if (!user) return { redirect: { permanent: false, destination: "/login" } };
  return { props: { session: user } };
});

const Transaction: NextPageWithLayout = ({ session }) => {
  const { query } = useRouter();
  const [display, setDisplay] = React.useState(true);
  const { data = { transaction: {} }, isLoading: fetchLoading } =
    useGetTransactionQuery({
      id: query.id,
      userId: session.id,
    });
  const [updateTransaction, { isLoading }] = useUpdateTransactionMutation();
  const navHeight = useGetHeight("#nav");
  const loginHeight = useGetHeight("#navLogin");
  const { amount, date, category, comment } = data.transaction as Transaction;
  let content;
  if (fetchLoading) {
    content = <Spinner variants={{ width: "md", margin: 4 }} />;
  } else {
    content = display ? (
      <DisplayDetails
        details={{ transactionId: query.id, amount, date, category, comment }}
        displayOff={() => setDisplay(false)}
      />
    ) : (
      <DataProvider>
        <TransactionForm
          user={session}
          displayOn={() => setDisplay(true)}
          transactionType={category.type}
          transactionAmount={amount}
          categoryId={category.id}
          transactionComment={comment}
          transactionDate={new Date(date)}
          mutation={(data) => {
            return updateTransaction({ ...data, id: query.id }).unwrap();
          }}
          status={{ isLoading }}
        />
      </DataProvider>
    );
  }

  return (
    <main
      className="max-w-md mx-auto"
      style={{ paddingTop: loginHeight + 10, paddingBottom: navHeight + 20 }}
    >
      <header className="px-2 mb-4 capitalize">
        <h1 className="text-lg">
          <strong className="relative z-10 font-medium text-gray-700 before:absolute before:-z-10 before:left-0 before:bottom-0 before:w-full before:h-2 before:bg-gradient-to-tr from-pink-200 to-blue-100 ">
            transaction details
          </strong>
        </h1>
      </header>

      {content}
    </main>
  );
};

// page layout
Transaction.Layout = function getLayout(page) {
  return (
    <Layout
      withHeader
      session={page.props.session}
      title="transaction"
      className="px-2 py-4"
    >
      {page}
    </Layout>
  );
};

function DisplayDetails({ details, displayOff }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [deleteTranaction, { isLoading }] = useDeleteTransactionMutation();
  const router = useRouter();
  const { amount, category, date, comment, transactionId } = details;

  return (
    <div className="grid gap-4 px-2">
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
      <div className="flex gap-4 py-4">
        <button
          type="button"
          className="basis-1/3 py-1 capitalize shadow rounded-md"
          onClick={displayOff}
        >
          update
        </button>
        <button
          type="button"
          className="basis-1/3 py-1 capitalize text-gray-500 bg-gray-100 bg-opacity-60 rounded-md"
          onClick={() => setIsOpen(true)}
        >
          delete
        </button>
        {isOpen && (
          <Modal
            headerTxt="delete transaction"
            confirmationStatus={{ isLoading }}
            onConfirm={() => {
              deleteTranaction({ id: transactionId })
                .unwrap()
                .then((payload) => {
                  console.log({ payload });
                  router.push("/transactions");
                })
                .catch((err) => console.error({ err }))
                .finally(() => setIsOpen(false));
            }}
            close={() => setIsOpen(false)}
          >
            <p>Are you sure you want to delete this transaction!</p>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default Transaction;
