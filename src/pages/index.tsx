import dynamic from "next/dynamic";
import React from "react";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import { withSessionSsr } from "@lib/session";
import { useGetHeight } from "@lib/helpers/hooks";
import { Spinner } from "@components/ui";
import { User } from "@prisma/client";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CURRENCIES } from "src/constants";
import { Icon } from "@components/icons";
// import { Transaction } from "@features/transaction";

type HomeProps = {
  user: User;
};

// dynamically import the component to reduce `js` loaded by browser.
const Transaction = dynamic(
  () => import("@features/transaction").then(({ Transaction }) => Transaction),
  {
    ssr: false,
    loading: () => <Spinner variants={{ width: "lg" }} />,
  }
);

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const { user } = req.session;

  // redirect to loginPage.
  if (!user) return { redirect: { permanent: false, destination: "/login" } };

  return {
    props: { user },
  };
});

// component
const Home: NextPageWithLayout<HomeProps> = ({ user }) => {
  const navHeight = useGetHeight("#nav");
  const loginHeight = useGetHeight("#navLogin");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(CURRENCIES[0]);

  const filteredPeople =
    query === ""
      ? CURRENCIES
      : CURRENCIES.filter(([, v]) =>
          v
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );


  return (
    <main
      className="flex flex-col justify-center items-center min-h-full"
      style={{ paddingTop: loginHeight + 10, paddingBottom: navHeight + 20 }}
    >
      {/* <Transaction user={user} /> */}
      <h1>select currency</h1>
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(curr: typeof selected) => curr[1]}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <Icon
                href="/sprite.svg#arrows"
                className="h-5 w-5 text-gray-400 fill-slate-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPeople.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredPeople.map((curr) => (
                  <Combobox.Option
                    key={curr[0]}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-gray-200 " : "text-gray-900"
                      }`
                    }
                    value={curr}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {curr[1]}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3`}
                          >
                            <Icon
                              href="/sprite.svg#check"
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </main>
  );
};

//page layout
Home.Layout = function getLayout(page) {
  //TODO:on page transition display animate the background
  const { user } = page.props;
  return (
    <Layout session={user} withHeader title="home" className="mt-6">
      {page}
    </Layout>
  );
};

export default Home;
