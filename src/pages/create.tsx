import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import React from "react";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import { StepperForm } from "@components/StepperForm";


const Create: NextPageWithLayout = () => {
  const steps = [
    { label: "step 1", active: true },
    { label: "step 2", active: false },
    { label: "step 3", active: false },
  ];

  return (
    <main className="w-full flex flex-col items-center">
      <h2 className="px-6 text-xl mb-10">
        just 3 steps away from creating your transaction{" "}
      </h2>
      <StepperForm steps={steps} />
    </main>
  );
};

Create.Layout = function getLayout(page) {
  return (
    <Layout title="create" className="w-full mt-[10vh]">
      {page}
    </Layout>
  );
};

export default Create;
