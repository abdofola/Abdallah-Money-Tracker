import React from "react";
import { NextComponentType, NextPage, NextPageContext } from "next";
import { Provider } from "react-redux";
import { store } from "../app/store";
import type { AppProps } from "next/app";
import "../styles/globals.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  Layout?: React.FC<NextComponentType<NextPageContext, any, {}>>;
};
type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout };

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // use the layout defined at the page level, if available!
  const Layout = Component.Layout ?? ((page) => page);

  return (
    <Provider store={store}>{Layout(<Component {...pageProps} />)}</Provider>
  );
}

export default MyApp;
