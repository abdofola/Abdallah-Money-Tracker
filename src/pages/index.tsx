import React from "react";
import { GetServerSideProps } from "next";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import { Transaction } from "@features/transaction";
import { TransactionElement } from "@features/transaction/types";
import styles from "../styles/Home.module.css";
import { client } from "@lib/helpers";

type Transactions<T = TransactionElement> = {
  income: T[];
  expenses: T[];
};
type HomeProps = {
  data: Transactions;
  error: string;
  initialValue: Transactions;
};

export const getServerSideProps: GetServerSideProps = async () => {
  let transactions: Transactions;
  return client("/transactions")
    .then((data) => {
      transactions = data.data.reduce((acc, curr) => {
        const { id, category, amount } = curr;

        acc[category.type].push({
          ...curr,
          key: id,
          title: category.name,
          value: Number(amount),
          color: category.color,
          amount: Number(amount),
        });

        return acc;
      }, {income:[], expenses:[]} as Transactions);

      return {
        props: {
          data: transactions,
          error: data.error,
        },
      };
    })
    .catch((error) => {
      return {
        props: { error: error.message, data: null },
      };
    });
};

// COMPONENT
const Home: NextPageWithLayout<HomeProps> = ({
  data,
  error,
  initialValue = { income: [], expenses: [] },
}) => {
  if (error) {
    console.error({ error });
  }

  return (
    <main className={styles.main}>
      <Transaction data={!error ? data : initialValue} />
    </main>
  );
};

Home.Layout = function getLayout(page) {
  return <Layout title="home">{page}</Layout>;
};

export default Home;
