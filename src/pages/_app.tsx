import React from "react";
import { NextPage } from "next";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { AppProps } from "next/app";
import ErrorBoundary from "@components/ErrorBoundary";
import "../styles/globals.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  Layout?: (page: React.ReactElement) => React.ReactNode;
};
type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout };

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // use the layout defined at the page level, if available!
  const Layout = Component.Layout ?? ((page) => page);

  return (
    <Provider store={store}>
      <ErrorBoundary>{Layout(<Component {...pageProps} />)}</ErrorBoundary>
    </Provider>
  );
}

export default MyApp;
