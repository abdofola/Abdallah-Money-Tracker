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
import { useAuth } from "@lib/helpers/hooks";

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

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const { session } = req;

    console.log("getServerSideProps", { session });
    // if (!session.user)
    //   return { redirect: { permanent: false, destination: "/signup" } };
    return { props: {} };
  }
);

// COMPONENT
const Home: NextPageWithLayout<HomeProps> = () => {
  const {user: auth} = useAuth();
  console.log({auth})
  const { data, isLoading, isSuccess, error } = useGetUserQuery({
    email: auth?.email,
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
      transactions[trans.category.type].push({
        ...trans,
        key: trans.id,
        color: trans.category.color,
        value: trans.amount,
      });
    }
    user.transactions = transactions;
    user.categories = categories;
    user.id = auth?.id;
  }

  return (
    <main className={styles.main}>
      {isLoading && <h1>loading...</h1>}
      {isSuccess && <Transaction user={user} />}
    </main>
  );
};

//page layout
Home.Layout = (page) => {
  return (
    <Layout title="home" className="p-2" withHeader>
      {page}
    </Layout>
  );
};

Home.Layout.displayName = "Layout";

export default Home;
