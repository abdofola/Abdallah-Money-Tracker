import dynamic from "next/dynamic";
import React from "react";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import { Transform } from "@features/transaction/types";
import { useGetUserQuery } from "@services";
import { Category } from "@prisma/client";
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
  const { data, isLoading, isFetching, isSuccess, error } = useGetUserQuery({
    email: session.email,
  });
  const loginHeight = useGetHeight("#navLogin");
  const user: {
    id: string;
    categories: Transform<Category>;
  } = {};

  if (error) {
    //TODO: do something here
    console.error("error while fetching user", { error });
  }

  if (isSuccess) {
    // transforming the response array into object
    // using regular for loop instead of `Array.prototype.reduce` due to performance reasons.
    const categories = {
      income: [],
      expenses: [],
    } as typeof user["categories"];

    for (const cat of data.user.categories) {
      categories[cat.type].push(cat);
    }
    user.categories = categories;
    user.id = session?.id;
  }

  return (
    <main
      className="flex justify-center items-center min-h-full"
      style={{ paddingTop: loginHeight }}
    >
      <div className="mt-8">
        {isLoading && <Spinner variants={{ width: "lg" }} />}
      </div>
      {isSuccess && <Transaction user={user} />}
    </main>
  );
};

//page layout
Home.Layout = function getLayout(page) {
  return (
    <Layout withHeader title="home">
      {page}
    </Layout>
  );
};

export default Home;
