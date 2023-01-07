import React from "react";
import Head from "next/head";

type SeoProps = {
  title: string;
};
const SEO: React.FC<SeoProps> = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content="App built with nextjs and prisma, to track your spending."
      />
    </Head>
  );
};

export default SEO;
