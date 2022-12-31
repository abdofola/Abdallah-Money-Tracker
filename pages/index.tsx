///TODO: fix the problem of typescript check.
import React from "react";
import { GetServerSideProps } from "next";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import styles from "../styles/Home.module.css";
import { Transaction } from "@components/Transaction";

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch(process.env.API_URL + "/transactions");
    if (!response.ok) {
      const errorTxt = await response.text();
      return {
        props: {
          data: null,
          error: new Error(errorTxt).message,
        },
      };
    }
    const data = await response.json();
    return {
      props: {
        data,
        error: null,
      },
    };
  } catch (error) {
    return {
      props: { data: null, error: error.message },
    };
  }
};

// COMPONENT
const Home: NextPageWithLayout = ({
  data,
  error,
  initalValue = { income: [], expenses: [] },
}) => {
  const [transactions] = React.useState(() => {
    return error
      ? initalValue
      : data.reduce((acc, curr) => {
          const { id, name, category, amount, color } = curr;
          const [hue, saturation, light] = color;

          acc[name].push({
            ...curr,
            key: id,
            title: category,
            value: amount,
            color: `hsl(${hue},${saturation * 100}%,${light * 100}%)`,
          });

          return acc;
        }, initalValue);
  });

  return (
    <main className={styles.main}>
      <Transaction data={transactions} />
    </main>
  );
};


Home.Layout = function getLayout(page) {
  return <Layout title="home">{page}</Layout>;
};

export default Home;
