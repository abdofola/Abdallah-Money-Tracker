import React from "react";
import Head from "next/head";

type SeoProps = {
  title: string;
  meta?: { name: string; content: string };
};
const SEO: React.FC<SeoProps> = ({ title, meta }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content="App built with nextjs and prisma, to track your spending."
      {...meta}
      />
    </Head>
  );
};

export default SEO;
