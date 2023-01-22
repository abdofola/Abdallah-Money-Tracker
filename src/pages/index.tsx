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

type HomeProps = {
  session?: { email: String; [k: string]: any };
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
  const { session } = req;

  console.log({ session });
  if (!session.user)
    return { redirect: { permanent: false, destination: "/signup" } };
  return { props: { session: session.user } };
});

// COMPONENT
const Home: NextPageWithLayout<HomeProps> = ({ session }) => {
  const { data, isLoading, isSuccess, error } = useGetUserQuery({
    email: session?.email,
  });
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
    for (const cat of data.user.categories) {
      categories[cat.type].push(cat);
    }
    const transactions = { income: [], expenses: [] };
    for (const trans of data.user.transactions) {
      categories[trans.category.type].push({
        ...trans,
        key: curr.id,
        color: trans.category.color,
        value: trans.amount,
      });
    }
    user.transactions = transactions;
    user.categories = categories;
    user.id = session.id;
  }

  console.log({ user, session });
  return (
    <main className={styles.main}>
      {isLoading && <h1>loading...</h1>}
      {isSuccess && <Transaction user={user} />}
    </main>
  );
};

//page layout
Home.Layout = function getLayout(page) {
  return (
    <Layout title="home" className="p-2" withHeader>
      {page}
    </Layout>
  );
};

export default Home;
