import React from "react";
import { NextPage } from "next";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { AppProps } from "next/app";
import ErrorBoundary from "@components/ErrorBoundary";
import { useRouter } from "next/router";
import { Transition } from "@components/Transition";
import "../styles/globals.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  Layout?: (page: React.ReactElement) => React.ReactNode;
};
type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout };

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  // use the layout defined at the page level, if available!
  const Layout = Component.Layout ?? ((page) => page);
  const Page = Layout(<Component {...pageProps} />);

  // page's loading effect when navigating between pages.
  React.useEffect(() => {
    const onStart = (_url: string) => setIsLoading(true);
    const onComplete = (_url: string) => setIsLoading(false);

    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", onComplete);

    //cleanup
    return () => {
      router.events.off("routeChangeStart", onStart);
      router.events.off("routeChangeComplete", onComplete);
    };
  }, [router]);

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Transition
          isMounted={isLoading}
          delay={0}
          as={() => (
            <span className="animate-progress fixed top-0 z-50 h-1 bg-black" />
          )}
        />
        <div className={` ${isLoading ? "opacity-25" : ""} `}>{Page}</div>
      </ErrorBoundary>
    </Provider>
  );
}

export default MyApp;
