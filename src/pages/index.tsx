import dynamic from "next/dynamic";
import React from "react";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import { Welcoming } from "@components/Welcoming";
import { Currency } from "@features/currency";
import { withSessionSsr } from "@lib/session";
import { useGetHeight, useWindowResize } from "@lib/helpers/hooks";
import { Spinner } from "@components/ui";
import { User } from "@prisma/client";
import { useAddCurrencyMutation, useUpdateUserMutation } from "@app/services";
import { CURRENCIES } from "src/constants";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import {
  CurrencyState,
  selectCurrentCurrency,
  setCurrency,
} from "@features/currency";
import { useRouter } from "next/router";
import { Stepper } from "@components/Stepper";
import { ar, en } from "@locales";
import { Icon } from "@components/icons";
import { request, gql } from "graphql-request";
import { enviroment } from "@lib/enviroment";
// import { Transaction } from "@features/transaction";

type HomeProps = {
  user: User;
};

// dynamically import the component to reduce `js` loaded by browser.
const Transaction = dynamic(
  () => import("@features/transaction").then(({ Transaction }) => Transaction),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto">
        <Spinner variants={{ width: "lg" }} />
      </div>
    ),
  }
);

const query = gql`
  query ($email: String!) {
    user(email: $email) {
      last_login
    }
  }
`;

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const { user } = req.session;
  const url = enviroment[process.env.NODE_ENV] + "/api/graphql";

  // redirect to loginPage.
  if (!user) return { redirect: { permanent: false, destination: "/login" } };

  const {
    user: { last_login },
  } = await request(url, query, { email: user.email });

  return {
    props: { user: { ...user, last_login } },
  };
});

// component
const Home: NextPageWithLayout<HomeProps> = ({ user }) => {
  const [isFinished, setIsFinished] = React.useState(false);
  const { locale, replace, asPath } = useRouter();
  const navHeight = useGetHeight("#nav");
  const loginHeight = useGetHeight("#navLogin");
  const windowWidth = useWindowResize();
  const [selected, setSelected] = React.useState<
    [CurrencyState["short"], string]
  >(["", ""]);
  const dispatch = useAppDispatch();
  const [updateUser, { isLoading: isLoadingUserM, isSuccess: isSuccessUserM }] =
    useUpdateUserMutation();
  const [
    addCurrency,
    { isLoading: isLoadingCrncM, isSuccess: isSuccessCrncM },
  ] = useAddCurrencyMutation();
  const translation = locale === "en" ? en : ar;
  const smScreen = 640;
  const addCurrencyHandler = async (name: CurrencyState["short"]) => {
    // allow the user to only add one currency.
    if (isSuccessCrncM) return;

    try {
      const {
        addCurrency: { id, name: short },
      } = await addCurrency({
        name,
        userId: user.id,
      }).unwrap();
      await updateUser({
        id: user.id,
        last_login: new Date(),
      }).unwrap();
      dispatch(
        setCurrency({
          id,
          short: short as CurrencyState["short"],
          long: CURRENCIES.find((c) => c[0] === short)![1],
        })
      );
    } catch (err) {
      console.error({ err });
    }
  };

  // console.log({ user });
  return (
    <main
      className="grid items-center w-full min-h-full"
      style={{
        paddingTop: windowWidth >= smScreen ? navHeight : loginHeight,
        paddingBottom: navHeight,
      }}
    >
      {user.last_login || isFinished ? (
        <Transaction user={user} />
      ) : (
        <Stepper
          className="flex flex-col items-center w-full max-w-4xl mx-auto my-8 p-2"
          steps={[
            { id: 1, Component: <Welcoming />, completed: true },
            {
              id: 2,
              Component: (
                <Currency
                  selected={selected}
                  setSelected={setSelected}
                  renderSubmitButton={(name) => {
                    return (
                      <button
                        disabled={name === ""}
                        onClick={() => addCurrencyHandler(name)}
                        className="grid place-items-center w-full h-10 rounded-lg bg-white capitalize shadow-3D disabled:opacity-30"
                      >
                        {isLoadingCrncM || isLoadingUserM ? (
                          <Spinner />
                        ) : isSuccessCrncM && isSuccessUserM ? (
                          <Icon
                            href="/sprite.svg#thumbs-up"
                            className="w-6 h-6"
                          />
                        ) : (
                          translation.currency.button
                        )}
                      </button>
                    );
                  }}
                />
              ),
              completed: isSuccessCrncM,
            },
          ]}
          cb={() => {
            setIsFinished(true);
            // triggering gSSP; to query the new value of `user.last_login`
            replace(asPath);
          }}
        />
      )}
    </main>
  );
};

//page layout
Home.Layout = function getLayout(page) {
  //TODO: 
  //should not show any route,
  // if the user is logged-in for the first time.
  //until they completed all the required steps.
  const { user } = page.props;
  return (
    <Layout session={user} withHeader title="home" className="h-screen">
      {page}
    </Layout>
  );
};

export default Home;
