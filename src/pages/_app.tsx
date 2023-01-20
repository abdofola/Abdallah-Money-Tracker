import React from "react";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { store } from "../app/store";
import "../styles/globals.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  Layout?: (page: React.ReactElement) => React.ReactNode;
};
type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout };

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // use the layout defined at the page level, if available!
  const Layout = Component.Layout ?? ((page) => page);

  return (
    <UserProvider>
      <Provider store={store}>{Layout(<Component {...pageProps} />)}</Provider>
    </UserProvider>
  );
}

export default MyApp;
