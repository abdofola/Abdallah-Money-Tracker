import React from "react";
import { SEO } from "@components/SEO";
import { Header } from "@components/Header";
import { User } from "@prisma/client";
// import styles from "./Layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
  title: string;
  session?: { user: User };
  withHeader?: boolean;
  [key: string]: any;
};

const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  withHeader = false,
  session,
  ...style
}) => {
  return (
    <div className="w-full h-full">
      <SEO title={title} />
      {withHeader && <Header user={session} />}
      <div {...style}>{children}</div>
    </div>
  );
};

export default Layout;
