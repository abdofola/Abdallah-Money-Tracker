import dynamic from "next/dynamic";
import React from "react";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import { Welcoming } from "@components/Welcoming";
import { Currency } from "@features/currency";
import { withSessionSsr } from "@lib/session";
import {
  useGetHeight,
  useLocalStorage,
  useWindowResize,
} from "@lib/helpers/hooks";
import { Spinner } from "@components/ui";
import { User } from "@prisma/client";
import { useAddCurrencyMutation } from "@app/services";
import { CURRENCIES } from "src/constants";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import {
  CurrencyState,
  selectCurrentCurrency,
  setCurrency,
} from "@features/currency";
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
  const windowWidth = useWindowResize();
  const [selected, setSelected] = React.useState<[string, string]>(["", ""]);
  const dispatch = useAppDispatch();
  const currency = useAppSelector(selectCurrentCurrency);
  const [addCurrency, { isLoading, isSuccess, isError, error }] =
    useAddCurrencyMutation();
  const smScreen = 640;

  if (isSuccess) {
    console.log("currency add successfully");
  }
  if (isError) {
    console.log({ error });
  }

  console.log({ currency });
  return (
    <main
      className="grid w-full min-h-full"
      style={{
        paddingTop: windowWidth >= smScreen ? navHeight : loginHeight,
        paddingBottom: navHeight,
      }}
    >
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto my-8 p-2">
        {/* <Welcoming /> */}
        <Transaction user={user} />
        {/* <Currency
          selected={selected}
          setSelected={setSelected}
          isLoading={isLoading}
          renderSubmitButton={(name, jsx) => {
            return (
              <button
                disabled={name === ""}
                onClick={async () => {
                  const {
                    addCurrency: { id, name: short },
                  } = await addCurrency({
                    name,
                    userId: user.id,
                  }).unwrap();
                  dispatch(
                    setCurrency({
                      id,
                      short: short as CurrencyState["short"],
                      long: CURRENCIES.find((c) => c[0] === short)![1],
                    })
                  );
                }}
                className="grid place-items-center w-full h-10 rounded-lg bg-white capitalize shadow-3D disabled:opacity-30"
              >
                {jsx}
              </button>
            );
          }}
        /> */}
      </div>
      {/* 
      TODO:
      1- render the `Transaction` comp. after selecting the currency.
      2- track if the user is logged-in for the first time to show welcoming
        components, to gide the user step by step to set up his account.
      3- otherwise display `Transaction` component.
      */}
    </main>
  );
};

//page layout
Home.Layout = function getLayout(page) {
  //TODO:on page transition display animate the background
  const { user } = page.props;
  return (
    <Layout session={user} withHeader title="home" className="h-screen">
      {page}
    </Layout>
  );
};

export default Home;
