import React from "react";
import { SEO } from "@components/SEO";
import { Header } from "@components/Header";

type LayoutProps = {
  children: React.ReactNode;
  title: string;
  className?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, title, ...style }) => {
  return (
    <>
      <SEO title={title} />
      <Header />
      <div {...style}>{children}</div>
    </>
  );
};

export default Layout;
