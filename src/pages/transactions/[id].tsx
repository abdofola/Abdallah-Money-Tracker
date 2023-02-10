import React from "react";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "./_app";
import { withSessionSsr } from "@lib/session";
import { Layout } from "@components/Layout";
import { useAuth, useGetHeight } from "@lib/helpers/hooks";
import { Spinner } from "@components/ui";
import { useGetTransactionQuery } from "@app/services/api";

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const { user } = req.session;

  console.log("-----getServerSideProps---->", { session: user });
  if (!user) return { redirect: { permanent: false, destination: "/login" } };
  return { props: { session: user } };
});

const Transaction: NextPageWithLayout = ({ session }) => {
  const { query } = useRouter();
  const { data } = useGetTransactionQuery({ id: query.id, userId: session.id });
  const navHeight = useGetHeight("#nav");
  const loginHeight = useGetHeight("#navLogin");

  /**
   * TODO:
   * 1- api call to get the transaction of this id
   * 2- display the transaction, with options to mutate
   */
  return (
    <div
      style={{ paddingTop: loginHeight + 10, paddingBottom: navHeight + 20 }}
    >
      <pre>{JSON.stringify(data?.transaction, null, 2)}</pre>
    </div>
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

export default Transaction;
