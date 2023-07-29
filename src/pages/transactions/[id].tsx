import React, { FormEvent } from "react";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "../_app";
import { withSessionSsr } from "@lib/session";
import { Layout } from "@components/Layout";
import { useGetHeight, useWindowResize } from "@lib/helpers/hooks";
import { Modal, Spinner } from "@components/ui";
import {
  useDeleteTransactionMutation,
  useGetTransactionQuery,
  useUpdateTransactionMutation,
} from "@app/services";
import { DisplayAmount, TransactionForm } from "@features/transaction";
import { DataProvider } from "@components/contexts";
import { Transaction, User } from "@prisma/client";
import { en, ar } from "@locales";
import { Category, TransactionElement } from "@features/transaction/types";
import { Transition } from "@components/Transition";
import { Delete, Icon } from "@components/icons";

type DetailProps = {
  details: Partial<TransactionElement> & { transactionId: string };
  displayOff: () => void;
};

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const { user } = req.session;

  if (!user) return { redirect: { permanent: false, destination: "/login" } };

  return { props: { user } };
});

// page component
const Transaction: NextPageWithLayout<{ user: User }> = ({ user }) => {
  const { query, locale } = useRouter();
  const [display, setDisplay] = React.useState(true);
  const { data = { transaction: {} }, isLoading: trxQueryLoading } =
    useGetTransactionQuery({
      id: query.id as string,
      // userId: user.id,
    });
  const [updateTransaction, { isLoading: isLoadingTrxM }] =
    useUpdateTransactionMutation();
  const windowWidth = useWindowResize();
  const navHeight = useGetHeight("#nav");
  const loginHeight = useGetHeight("#navLogin");
  const { amount, date, category, comment } =
    data.transaction as Transaction & { category: Category };
  const translation = locale === "en" ? en : ar;
  const smScreen = 640;
  let content;
  if (trxQueryLoading) {
    content = <Spinner variants={{ width: "md", margin: "4" }} />;
  } else {
    content = display ? (
      <DisplayDetails
        details={{
          transactionId: query.id as string,
          amount,
          date,
          category,
          comment,
        }}
        displayOff={() => setDisplay(false)}
      />
    ) : (
      <DataProvider>
        <TransactionForm
          user={user}
          canAddCategory={false}
          displayOn={() => setDisplay(true)}
          transactionType={category.type}
          transactionAmount={String(amount)}
          categoryId={category.iconId}
          transactionComment={comment}
          transactionDate={new Date(date)}
          mutation={(data) => {
            return updateTransaction({ ...data, id: query.id }).unwrap();
          }}
          btnJSX={({ isLoading }) => (
            <button
              form="add_trx"
              className="flex justify-center items-center basis-1/3 h-10 capitalize  rounded-lg shadow-3D"
              type="submit"
            >
              {!isLoading && !isLoadingTrxM ? (
                translation.buttons.add
              ) : (
                <Spinner />
              )}
            </button>
          )}
        />
      </DataProvider>
    );
  }

  return (
    <main
      className="max-w-md mx-auto text-lg leading-relaxed"
      style={{
        paddingTop: windowWidth >= smScreen ? navHeight : loginHeight,
        paddingBottom: navHeight,
      }}
    >
      <header className="flex px-2 mb-4 capitalize">
        <h1 className="text-xl font-semibold sm:text-2xl">
          {translation.headings.details}
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
      className="px-2 py-8"
    >
      {page}
    </Layout>
  );
};

function DisplayDetails({ details, displayOff }: DetailProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [deleteTranaction, { isLoading }] = useDeleteTransactionMutation();
  const router = useRouter();
  const { locale } = router;
  const { amount, category, date, comment, transactionId } = details;
  const translation = locale === "en" ? en : ar;
  const btnText = locale === "en" ? "delete" : "حذف";
  const onConfirm = (e:FormEvent) => {
    e.preventDefault();
    deleteTranaction({ id: transactionId })
      .unwrap()
      .then((_payload) => {
        const url = `/transactions?category=${category?.id}&type=${category?.type}`;
        // console.log({ payload,url });
        router.push(url);
      })
      .catch((err) => console.error({ err }))
      .finally(() => setIsOpen(false));
  };

  return (
    <div className="grid gap-4 p-4 bg-white border rounded-md">
      <dl className="flex flex-col gap-1">
        <div>
          <dt className="text-gray-400">
            {translation.transactionDetails.amount}
          </dt>
          <dd>
            <DisplayAmount amount={amount!} />
          </dd>
        </div>
        <div>
          <dt className="text-gray-400">
            {translation.transactionDetails.category}
          </dt>
          <dd>{category?.name[locale as "ar" | "en"]}</dd>
        </div>
        <div>
          <dt className="text-gray-400">
            {translation.transactionDetails.date}
          </dt>
          <dd>{date?.toString()}</dd>
        </div>
        <Transition isMounted={Boolean(comment)}>
          <div>
            <dt className="text-gray-400">
              {translation.transactionDetails.comment}
            </dt>
            <dd>{comment}</dd>
          </div>
        </Transition>
      </dl>
      <div className="flex justify-end gap-4 py-4">
        <button
          type="button"
          className="bg-slate-100 p-2 rounded-full"
          onClick={displayOff}
        >
          <Icon href="/sprite.svg#edit" className="w-6 h-6" />
        </button>
        <button
          type="button"
          className="bg-slate-100 p-2 rounded-full"
          onClick={() => setIsOpen(true)}
        >
          <Delete className="w-6 h-6 stroke-red-400" />
        </button>
        <Transition isMounted={isOpen}>
          <Modal
            className="items-end sm:items-center"
            headerTxt={translation.headings.delete}
            isMounted={isOpen}
            close={() => setIsOpen(false)}
            onConfirm={onConfirm}
            confirmationButton={
              <button
                type="submit"
                className="grid place-items-center basis-1/3 h-10 text-center text-white bg-red-600 shadow-3D rounded-lg"
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
