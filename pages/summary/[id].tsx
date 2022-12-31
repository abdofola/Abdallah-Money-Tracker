import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import { NextPageWithLayout } from "pages/_app";
import useSWR from "swr";
import { Layout } from "@components/Layout";
import { Check, Cross, Delete } from "@components/icons";
import { allRecords, getSingleRecord } from "@api";
import { CustomForm } from "@components/MyForm";
import { client } from "@lib/helpers";
import { transactions } from "@lib/constants";
import styles from "../../styles/transaction.module.css";
import { useRouter } from "next/router";
import { Finance } from "@prisma/client";

export const getStaticPaths: GetStaticPaths = async () => {
  //TODO:handle error
  const data = await allRecords();
  const paths = data.map((finance) => ({ params: { id: finance.id } }));
  //TODO: read more about the options 'fallback'
  try {
    return {
      paths,
      fallback: true,
    };
  } catch (err) {
    console.log("fola");
  }
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  console.log({ ctx });
  // const data = await getSingleRecord(params?.id as string);

  // try {
  //   return {
  //     props: { data: JSON.parse(JSON.stringify(data)) },
  //   };
  // } catch (err) {
  //   console.log(err);
  //   // return { notFound: true };
  // }
  return {
    props: {},
  };
};

type TransactionProps = { data: Finance };

const getIcons = (props: any) => ({
  delete: <Delete {...props} />,
  check: <Check {...props} />,
  cross: <Cross {...props} />,
});
const getIconStyle = (name: string) =>
  ({
    delete: "bg-rose-50 text-rose-500",
    check: "bg-green-50 text-green-500 ",
    cross: "bg-slate-100 text-slate-500",
  }[name]);
const goBack = () => console.log("goBack");
const deleteRecord = () => console.log("deleteRecord");
const handleUpdate = (
  submitterRef: React.MutableRefObject<HTMLInputElement>
) => {
  console.log("handleUpdate");
  submitterRef.current.click();
};

const TransactionPage: NextPageWithLayout<TransactionProps> = ({
  data = {},
}) => {
  const { query } = useRouter();
  const { data: categories, error } = useSWR("api/finances", client);
  const submitterRef = React.useRef<HTMLInputElement>(null);
  const submitter = <input ref={submitterRef} hidden type="submit" />;
  const renderedIcons = Object.entries(getIcons({})).map(([name, Icon]) => (
    <li key={name} className="cursor-pointer">
      <button
        className={`${styles.iconButtons} ${getIconStyle(name)}`}
        onClick={handleClick(name)}
      >
        {Icon}
      </button>
    </li>
  ));
  const t = transactions.find((t) => t.name === data.type?.toLowerCase());

  function handleClick(name: string) {
    return () => {
      const handlerMap = new Map([
        ["check", handleUpdate],
        ["cross", goBack],
        ["delete", deleteRecord],
      ]);

      handlerMap.has(name)
        ? handlerMap.get(name)(submitterRef)
        : console.error("sorry, no match handler !");
    };
  }

  return (
    <>
      <div className="flex justify-between p-2">
        <h2 className="text-xl capitalize font-bold">record details</h2>
        <ul className="flex space-x-6">{renderedIcons}</ul>
      </div>
      {categories && (
        <CustomForm
          withDate
          data={categories ?? []}
          selected={{
            transaction: t ?? { name: query.type },
            category: Object.keys(data).length ? data : query,
          }}
          submitter={submitter}
        />
      )}
    </>
  );
};

TransactionPage.Layout = function getLayout(page) {
  return (
    <Layout title="transaction" className="container mx-auto sm:mt-6 max-w-2xl">
      {page}
    </Layout>
  );
};

export default TransactionPage;
