import React from "react";
import { SEO } from "@components/SEO";
import { Header } from "@components/Header";

type LayoutProps = {
  children: React.ReactNode;
  title: string;
  withHeader?: boolean;
  [key: string]: any;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  withHeader = false,
  ...style
}) => {
  return (
    <>
      <SEO title={title} />
      {withHeader && <Header />}
      <div {...style}>{children}</div>
    </>
  );
};

export default Layout;
