import dynamic from "next/dynamic";
import React from "react";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import { withSessionSsr } from "@lib/session";
import { useGetHeight } from "@lib/helpers/hooks";
import { Spinner } from "@components/ui";
import { User } from "@prisma/client";
import { Currency } from "@components/Currency";
import { useAddCurrencyMutation } from "@app/services";
// import { Transaction } from "@features/transaction";

type HomeProps = {
  user: User;
};

// dynamically import the component to reduce `js` loaded by browser.
const Transaction = dynamic(
  () => import("@features/transaction").then(({ Transaction }) => Transaction),
  {
    ssr: false,
    loading: () => <Spinner variants={{ width: "lg" }} />,
  }
);

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const { user } = req.session;

  // redirect to loginPage.
  if (!user) return { redirect: { permanent: false, destination: "/login" } };

  return {
    props: { user },
  };
});

// component
const Home: NextPageWithLayout<HomeProps> = ({ user }) => {
  const navHeight = useGetHeight("#nav");
  const loginHeight = useGetHeight("#navLogin");
  const [addCurrency, { isLoading, isSuccess, isError, error }] =
    useAddCurrencyMutation();

    if(isSuccess){
      console.log('currency add successfully')
    }
    if(isError){
      console.log({error})
    }
  return (
    <main
      className="flex flex-col items-center min-h-full"
      style={{ paddingTop: loginHeight + 10, paddingBottom: navHeight + 20 }}
    >
      {/* 
      TODO:
      1- render the `Transaction` comp. after selecting the currency.
      2- track if the user is logged-in for the first time to show welcoming
        components, to gide the user step by step to set up his account.
      3- otherwise display `Transaction` component.
      */}
      {/* <Transaction user={user} /> */}
      <Currency
        isLoading={isLoading}
        onConfirm={(name: string) => {
          return addCurrency({ name, userId: user.id }).unwrap();
        }}
      />
    </main>
  );
};

//page layout
Home.Layout = function getLayout(page) {
  //TODO:on page transition display animate the background
  const { user } = page.props;
  return (
    <Layout session={user} withHeader title="home" className="mt-6 h-screen">
      {page}
    </Layout>
  );
};

export default Home;
