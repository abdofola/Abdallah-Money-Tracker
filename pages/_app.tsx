import "../styles/globals.css";
import type { AppProps } from "next/app";
import ErrorBoundary from "@components/ErrorBoundary";
import { NextPage } from "next";
import React from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  Layout?: (page: React.ReactElement) => React.ReactNode;
};
type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout };

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // use the layout defined at the page level, if available.
  const Layout = Component.Layout ?? ((page) => page);

  return Layout(<Component {...pageProps} />);
}

export default MyApp;
