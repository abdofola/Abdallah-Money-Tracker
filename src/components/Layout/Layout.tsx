import React from "react";
import { SEO } from "@components/SEO";
import { Header } from "@components/Header";
import { useGetHeight } from "@lib/helpers/hooks";
import styles from "./Layout.module.css";

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
    <div className={styles.container}>
      <SEO title={title} />
      {withHeader && <Header />}
      <div {...style}>{children}</div>
    </div>
  );
};

export default Layout;
