import dynamic from "next/dynamic";
import React from "react";
import { GetServerSideProps } from "next";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import { Transform } from "@features/transaction/types";
import { useGetUserQuery } from "@services";
import { Transaction, Category } from "@prisma/client";
import styles from "../styles/Home.module.css";
import { withSessionSsr } from "@lib/session";
import { useGetHeight } from "@lib/helpers/hooks";

type HomeProps = {
  session: { email: string; [k: string]: any };
};

const Transaction = dynamic(
  () => import("@features/transaction").then(({ Transaction }) => Transaction),
  {
    ssr: false,
    loading: (loadingProps) => (
      <h1 className="mt-10 text-center">loading...</h1>
    ),
  }
);

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const { user } = req.session;

  console.log("-----getServerSideProps---->", { session: user });
  if (!user) return { redirect: { permanent: false, destination: "/login" } };
  return { props: { session: user } };
});

// COMPONENT
const Home: NextPageWithLayout<HomeProps> = ({ session }) => {
  const { data, isLoading, isSuccess, error } = useGetUserQuery({
    email: session.email,
  });
  const loginHeight = useGetHeight("#navLogin");
  const user: {
    transactions: Transform<Transaction>;
    categories: Transform<Category>;
  } = {};

  if (error) {
    //TODO: do something here
    console.error({ error });
  }

  if (isSuccess) {
    // transforming the response array into object
    // using regular for loop instead of `Array.prototype.reduce` cuz performance reasons.
    const categories = { income: [], expenses: [] };
    const transactions = { income: [], expenses: [] };
    
    for (const cat of data.user.categories) {
      categories[cat.type].push(cat);
    }
    for (const trans of data.user.transactions) {
      transactions[trans.category.type].push({
        ...trans,
        key: trans.id,
        color: trans.category.color,
        value: trans.amount,
      });
    }
    user.transactions = transactions;
    user.categories = categories;
    user.id = session?.id;
  }

  return (
    <main className={styles.main} style={{ paddingTop: loginHeight }}>
      {isLoading && <h1>loading...</h1>}
      {isSuccess && <Transaction user={user} />}
    </main>
  );
};

//page layout
//TODO:fix the typing
Home.Layout = (page) => {
  return (
    <Layout title="home" withHeader>
      {page}
    </Layout>
  );
};

Home.Layout.displayName = "Layout";

export default Home;
