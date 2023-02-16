import dynamic from "next/dynamic";
import React from "react";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import { withSessionSsr } from "@lib/session";
import { useGetHeight } from "@lib/helpers/hooks";
import { Spinner } from "@components/ui";

type HomeProps = {
  session: { id: string; email: string; [k: string]: any };
};

const Transaction = dynamic(
  () => import("@features/transaction").then(({ Transaction }) => Transaction),
  {
    ssr: false,
    loading: () => <Spinner variants={{ width: "lg" }} />,
  }
);

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const { user } = req.session;

  console.log("-----getServerSideProps---->", { session: user });
  if (!user) return { redirect: { permanent: false, destination: "/login" } };
  return { props: { session: user } };
});

// COMPONENT
const Home: NextPageWithLayout<HomeProps> = ({ session }) => {
  const navHeight = useGetHeight("#nav");
  const loginHeight = useGetHeight("#navLogin");

  return (
    <main
      className="flex justify-center items-center min-h-full"
      style={{ paddingTop: loginHeight + 10, paddingBottom: navHeight + 20 }}
    >
      <Transaction user={session} />
    </main>
  );
};

//page layout
Home.Layout = function getLayout(page) {
  return (
    <Layout session={page.props.session} withHeader title="home" className="mt-6">
      {page}
    </Layout>
  );
};

export default Home;
