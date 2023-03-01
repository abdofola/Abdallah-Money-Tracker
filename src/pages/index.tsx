import dynamic from "next/dynamic";
import React from "react";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import { withSessionSsr } from "@lib/session";
import { useGetHeight } from "@lib/helpers/hooks";
import { Spinner } from "@components/ui";
import { request, gql } from "graphql-request";
import { enviroment } from "@lib/enviroment";

type HomeProps = {
  session: { id: string; email: string; [k: string]: any };
};
const query = gql`
  query GetCategories($userId: String!) {
    categories(userId: $userId) {
      id
      name
      type
      iconId
      color
    }
  }
`;

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
  const url = enviroment[process.env.NODE_ENV] + "/api/graphql";

  const categories = { income: [], expenses: [] };
  // redirect to loginPage.
  if (!user) return { redirect: { permanent: false, destination: "/login" } };
  const cats = await request(url, query, { userId: user.id });

  // classify the categories by `type`, and map it to `categories` accordingly.
  for (let c of cats.categories) {
    categories[c.type].push(c);
  }
  return { props: { user: { ...user, categories } } };
});

// component
const Home: NextPageWithLayout<HomeProps> = ({ user }) => {
  const navHeight = useGetHeight("#nav");
  const loginHeight = useGetHeight("#navLogin");

  console.log({ user });

  return (
    <main
      className="flex justify-center items-center min-h-full"
      style={{ paddingTop: loginHeight + 10, paddingBottom: navHeight + 20 }}
    >
      <Transaction user={user} />
    </main>
  );
};

//page layout
Home.Layout = function getLayout(page) {
  return (
    <Layout session={page.props.user} withHeader title="home" className="mt-6">
      {page}
    </Layout>
  );
};

export default Home;
