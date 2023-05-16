import dynamic from "next/dynamic";
import React from "react";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import { withSessionSsr } from "@lib/session";
import { useGetHeight } from "@lib/helpers/hooks";
import { Spinner } from "@components/ui";
import { User } from "@prisma/client";
import { CURRENCIES } from "src/currencies";
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

/**
 * TODO:
 * 1- make welcoming component
 * 2- display user email, and ask them to select a currency for their account;
 * if it's there first signin.
 * 3- if not,  display the transaction component immdiately.
 * 
 *  
 */
// component
const Home: NextPageWithLayout<HomeProps> = ({ user }) => {
  const [currency, setCurrency] = React.useState("");
  const navHeight = useGetHeight("#nav");
  const loginHeight = useGetHeight("#navLogin");

  console.log({ currency });
  return (
    <main
      className="flex justify-center items-center min-h-full"
      style={{ paddingTop: loginHeight + 10, paddingBottom: navHeight + 20 }}
    >
      {/* <Transaction user={user} /> */}
      <select
        name="currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <option value="">--select currency--</option>
        {Object.entries(CURRENCIES).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </main>
  );
};

//page layout
Home.Layout = function getLayout(page) {
  //TODO:on page transition display animate the background
  const { user } = page.props;
  return (
    <Layout session={user} withHeader title="home" className="mt-6">
      {page}
    </Layout>
  );
};

export default Home;
