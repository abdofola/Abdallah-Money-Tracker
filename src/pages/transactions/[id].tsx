import React from "react";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import { withSessionSsr } from "@lib/session";
import { Layout } from "@components/Layout";
import { useGetHeight } from "@lib/helpers/hooks";
import { Modal, Spinner } from "@components/ui";
import {
  useDeleteTransactionMutation,
  useGetTransactionQuery,
  useUpdateTransactionMutation,
} from "@app/services/api";
import { TransactionForm } from "@features/transaction";
import { DataProvider } from "@components/contexts";
import { Transaction } from "@prisma/client";
import { request, gql } from "graphql-request";
import { enviroment } from "@lib/enviroment";
import { en, ar } from "@locales";
import { getUserWithCategories } from "..";
import { Category } from "@features/transaction/types";
import { Transition } from "@components/Transition";

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const { user } = req.session;
  const userWithCategories = await getUserWithCategories(user);

  return { props: { user: userWithCategories } };
});

// page component
const Transaction: NextPageWithLayout = ({ user }) => {
  const { query, locale } = useRouter();
  const [display, setDisplay] = React.useState(true);
  const { data = { transaction: {} }, isLoading: fetchLoading } =
    useGetTransactionQuery({
      id: query.id,
      userId: user.id,
    });
  const [updateTransaction, { isLoading }] = useUpdateTransactionMutation();
  const navHeight = useGetHeight("#nav");
  const loginHeight = useGetHeight("#navLogin");
  const { amount, date, category, comment } =
    data.transaction as Transaction & { category: Category };
  const translation = locale === "en" ? en : ar;
  let content;
  if (fetchLoading) {
    content = <Spinner variants={{ width: "md", margin: "4" }} />;
  } else {
    content = display ? (
      <DisplayDetails
        details={{ transactionId: query.id, amount, date, category, comment }}
        displayOff={() => setDisplay(false)}
      />
    ) : (
      <DataProvider>
        <TransactionForm
          user={user}
          canAddCategory={false}
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
      <header className="flex px-2 mb-4 capitalize">
        <h1 className="text-lg">
          <strong className="relative z-[1] font-medium text-gray-700 before:absolute before:-z-10 before:left-0 before:bottom-0 before:w-full before:h-2 before:bg-gradient-to-tr from-pink-200 to-blue-100 ">
            {translation.headings.details}
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
      session={page.props.user}
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
  const { locale } = router;
  const { amount, category, date, comment, transactionId } = details;
  const translation = locale === "en" ? en : ar;
  const btnText = locale === "en" ? "delete" : "حذف";

  return (
    <div className="grid gap-4 px-2">
      <dl className="flex flex-col gap-1">
        <div>
          <dt className="text-gray-400">
            {translation.transactionDetails.amount}
          </dt>
          <dd>{amount} </dd>
        </div>
        <div>
          <dt className="text-gray-400">
            {translation.transactionDetails.category}
          </dt>
          <dd>{category?.name[locale]} </dd>
        </div>
        <div>
          <dt className="text-gray-400">
            {translation.transactionDetails.date}
          </dt>
          <dd>{date}</dd>
        </div>
        {comment && (
          <div>
            <dt className="text-gray-400">
              {translation.transactionDetails.comment}
            </dt>
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
          {translation.buttons.update}
        </button>
        <button
          type="button"
          className="basis-1/3 py-1 capitalize text-gray-500 bg-gray-100 bg-opacity-60 rounded-md"
          onClick={() => setIsOpen(true)}
        >
          {translation.buttons.delete}
        </button>
        <Transition isMounted={isOpen}>
          <Modal
            headerTxt={translation.headings.delete}
            isMounted={isOpen}
            close={() => setIsOpen(false)}
            confirmationButton={
              <button
                type="button"
                className="flex justify-center basis-1/3 py-1 text-center bg-red-500 text-white rounded-md"
                onClick={() => {
                  deleteTranaction({ id: transactionId })
                    .unwrap()
                    .then((_payload) => {
                      const url = `/transactions?category=${category.id}&type=${category.type}`;
                      // console.log({ payload,url });
                      router.push(url);
                    })
                    .catch((err) => console.error({ err }))
                    .finally(() => setIsOpen(false));
                }}
              >
                {isLoading ? (
                  <Spinner variants={{ intent: "secondary", width: "xs" }} />
                ) : (
                  btnText
                )}
              </button>
            }
          >
            <p>{translation.messages.delete}</p>
          </Modal>
        </Transition>
      </div>
    </div>
  );
}

export default Transaction;
