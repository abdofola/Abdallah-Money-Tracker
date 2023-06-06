import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Document, Icon, Plus } from "@components/icons";
// import { useAuth } from "@lib/helpers/hooks";
import { en, ar } from "@locales";
import styles from "./Header.module.css";
import { Menu } from "@components/Menu";
import { Currency as TCurrency, User } from "@prisma/client";
import {
  Listbox,
  Transition as HLTransition,
  RadioGroup as HLRadioGroup,
} from "@headlessui/react";
import { Transition } from "@components/Transition";
import { useAddCurrencyMutation, useGetCurrenciesQuery } from "@services";
import { useLocalStorage, useWindowResize } from "@lib/helpers/hooks";
import { CURRENCIES } from "src/constants";
import { EmptyState, Modal, Spinner } from "@components/ui";
import { Currency } from "@features/currency";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import {
  CurrencyState,
  selectCurrentCurrency,
  setCurrency,
} from "@features/currency";

type P = {
  user: User;
};
type Lang = { short: "en" | "ar"; long: string };
type LanguageSelectionProps = {
  languages: Lang[];
};
type CurrenciesRadioProps = { currencies: TCurrency[] };
type Crnc = { [k in "id" | "short" | "long"]: string };

const pages = {
  home: { path: "/", Icon: <Home /> },
  statement: { path: "/transactions", Icon: <Document /> },
};
const languages: Lang[] = [
  { short: "en", long: "english" },
  { short: "ar", long: "عربي" },
];

const isActive = (path: string, pathname: string) => pathname === path;

// the user comes from cookie instead of state
// because when refreshing a page, the state gets destroyed
export default function Header({ user }: P) {
  const [isOpen, setIsOpen] = React.useState(false);
  const windowWidth = useWindowResize();
  const [selected, setSelected] = React.useState<[string, string]>(["", ""]);
  const { locale, pathname } = useRouter();
  const {
    data = { currencies: [] },
    isLoading: isLoadingQ,
    isFetching,
  } = useGetCurrenciesQuery({
    userId: user.id,
  });
  const [addCurrency, { isLoading: isLoadingM, error }] =
    useAddCurrencyMutation();
  const translation = locale === "en" ? en : ar;
  const smScreenPx = 640;
  const renderedListItems = Object.entries(pages).map(
    ([label, { path, Icon }]) => {
      return (
        <li key={label} className={styles.item}>
          <Link href={path} locale={locale}>
            <a
              className={styles.pageLink}
              data-active={isActive(path, pathname)}
            >
              <span className="sm:hidden">{Icon}</span>
              <span>{translation.nav[label as "home" | "statement"]}</span>
            </a>
          </Link>
        </li>
      );
    }
  );

  // setting `dir` and `lang` of the document in accordance to `locale`
  React.useEffect(() => {
    const html = window.document.querySelector("html")!;
    const dir = locale === "en" ? "ltr" : "rtl";
    html.dir = dir;
    html.lang = locale!;
  }, [locale]);

  return (
    <nav id="nav" className={styles.nav}>
      {/* <Transition isMounted={windowWidth >= smScreenPx}>
        <Link href={user ? "/api/logout" : "/login"}>
          <a className="flex justify-center items-center w-max h-full px-2 text-gray-500 bg-gray-50 rounded-xl row-start-2">
            {user ? translation.nav["logout"] : translation.nav["login"]}
          </a>
        </Link>
      </Transition> */}
      {/* pages' links */}
      <ul className={styles.list}>
        {/* logo & languages & menu on sm-screen  */}
        <li
          id="navLogin"
          className="shadow-lg fixed flex gap-4 justify-between bg-white border-b top-0 left-0 right-0 px-2 py-4 sm:static sm:border-none sm:p-0 sm:shadow-none"
        >
          <div className="px-2 flex items-center gap-6">
            {/* menu on small screen */}
            <Transition isMounted={windowWidth <= smScreenPx}>
              <div>
                <Menu>
                  <Menu.Button />
                  <Menu.Screen className="flex flex-col w-3/4 h-full p-4 gap-6 bg-white drop-shadow-lg">
                    <header className="flex items-center gap-1">
                      <span className=" p-2 bg-gradient-to-t from-gray-100 rounded-full">
                        <Icon
                          href="/sprite.svg#person-profile"
                          className="w-12 h-12 fill-gray-400"
                        />
                      </span>
                      <span className="text-lg">{user.email}</span>
                    </header>
                    <main className="space-y-2">
                      <h3 className="capitalize text-lg text-gray-600">
                        {translation.currency.sideMenu.available}
                      </h3>
                      {data.currencies.length > 0 ? (
                        <CurrenciesRadio currencies={data.currencies} />
                      ) : (
                        <EmptyState
                          iconJSX={
                            <Icon
                              href="/sprite.svg#person-currency"
                              className=" aspect-square"
                            />
                          }
                          renderParagraph={() => (
                            <p className="first-letter:capitalize text-gray-500">
                              {translation.currency.sideMenu.empty}
                            </p>
                          )}
                        />
                      )}

                      <Transition isMounted={data.currencies.length > 0}>
                        <button
                          className="flex items-end gap-2"
                          onClick={() => setIsOpen(true)}
                        >
                          <span className="p-1 rounded-lg shadow-3D ">
                            <Plus />
                          </span>
                          <span className="text-gray-400">
                            {translation.currency.sideMenu.add}
                          </span>
                        </button>
                      </Transition>
                      <Transition isMounted={isOpen}>
                        <Modal
                          className="items-center"
                          from="opacity-0 scale-0"
                          to="opacity-100 scale-100"
                          isMounted={isOpen}
                          headerTxt={translation.currency.sideMenu.add}
                          close={() => setIsOpen(false)}
                          confirmationButton={
                            <button
                              disabled={selected[0] === ""}
                              onClick={() => {
                                if (selected) {
                                  addCurrency({
                                    userId: user.id,
                                    name: selected[0],
                                  })
                                    .unwrap()
                                    .then(() => setIsOpen(false));
                                }
                              }}
                              className="basis-1/3 h-10 grid place-items-center rounded-lg bg-white capitalize shadow-3D disabled:opacity-30"
                            >
                              {isLoadingM ? (
                                <Spinner />
                              ) : (
                                translation.currency.button
                              )}
                            </button>
                          }
                        >
                          <Currency
                            selected={selected}
                            setSelected={setSelected}
                            className="capitalize text-lg"
                          />
                        </Modal>
                      </Transition>
                    </main>

                    <footer>
                      <Link href={user ? "/api/logout" : "/login"}>
                        <a className="flex items-center gap-2 capitalize">
                          <span>
                            <Icon
                              href="/sprite.svg#logout"
                              className="w-7 h-7 stroke-gray-100"
                            />
                          </span>
                          <span>
                            {user
                              ? translation.nav["logout"]
                              : translation.nav["login"]}
                          </span>
                        </a>
                      </Link>
                    </footer>
                  </Menu.Screen>
                </Menu>
              </div>
            </Transition>

            {/*  logo  */}
            <Link href="/" shallow>
              <a className="">
                <Icon
                  href="/sprite.svg#logo"
                  className="w-7 h-7 sm:w-10 sm:h-10"
                />
              </a>
            </Link>
          </div>

          {/* language selection on small screen */}
          <Transition isMounted={windowWidth <= smScreenPx}>
            <LanguageSelection languages={languages} />
          </Transition>
        </li>
        {renderedListItems}
        <Transition isMounted={windowWidth >= smScreenPx}>
          <li>
            <LanguageSelection languages={languages} />
          </li>
        </Transition>
      </ul>
    </nav>
  );
}

function LanguageSelection({ languages }: LanguageSelectionProps) {
  const { locale, push, query, asPath, pathname } = useRouter();
  const [selectedLanguage, setSelectedLanguage] = React.useState(() => {
    return languages.find((lang) => lang.short === (locale as Lang["short"]))!;
  });
  return (
    <div className={styles.lang}>
      <Listbox
        value={selectedLanguage}
        onChange={(lang) => {
          setSelectedLanguage(lang);
          push({ pathname, query }, asPath, {
            locale: lang.short,
            shallow: true,
          });
        }}
      >
        <div className="relative">
          <Listbox.Button
            className={`relative w-full cursor-pointer rounded-lg bg-white py-2 ${
              locale === "en" ? "pl-3 pr-10" : "pr-3 pl-10"
            }  border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm`}
          >
            <span className="block truncate">{selectedLanguage.long}</span>
            <span
              className={`pointer-events-none absolute inset-y-0 ${
                locale === "en" ? "right-0 pr-2" : "left-0 pl-2"
              }  flex items-center `}
            >
              <Icon
                href="/sprite.svg#arrows"
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <HLTransition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {languages.map((lang) => (
                <Listbox.Option
                  key={lang.short}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-gray-100" : ""
                    }`
                  }
                  value={lang}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block  ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {lang.long}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <Icon
                            href="/sprite.svg#check"
                            className="h-5 w-5 fill-gray-900"
                            aria-hidden="true"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </HLTransition>
        </div>
      </Listbox>
    </div>
  );
}

function CurrenciesRadio({ currencies }: CurrenciesRadioProps) {
  const dispatch = useAppDispatch();
  const currency = useAppSelector(selectCurrentCurrency);
  const [curcLS, _] = useLocalStorage<CurrencyState>("currency", {
    id: "",
    short: "",
    long: "",
  });
  const [selected, setSelected] = useState(() => {
    return currencies.find(
      (crnc) => crnc.name === (currency.short || curcLS.short)
    );
  });

  // console.log({ selected, currency });
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-md">
        <HLRadioGroup
          value={selected}
          onChange={(c) => {
            setSelected(c);
            dispatch(
              setCurrency({
                id: c.id,
                short: c.name as CurrencyState["short"],
                long: CURRENCIES.find(([k, _v]) => k === c.name)![1],
              })
            );
          }}
        >
          <HLRadioGroup.Label className="sr-only">
            currencies
          </HLRadioGroup.Label>
          <div className="space-y-2">
            {currencies.map((c) => (
              <HLRadioGroup.Option
                key={c.id}
                value={c}
                className={({ active, checked }) =>
                  `${
                    active
                      ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                      : ""
                  }
                ${checked ? "bg-sky-900 bg-opacity-75 text-white" : "bg-white"}
                  relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <HLRadioGroup.Label
                            as="p"
                            className={`flex flex-col font-medium  ${
                              checked ? "text-white" : "text-gray-900"
                            }`}
                          >
                            <span>
                              {CURRENCIES.find(([k, _]) => k === c.name)![1]}
                            </span>
                            <span>
                              {CURRENCIES.find(([k, _]) => k === c.name)![0]}
                            </span>
                          </HLRadioGroup.Label>
                          <HLRadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? "text-sky-100" : "text-gray-500"
                            }`}
                          ></HLRadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <Icon
                            href="/sprite.svg#check"
                            className="h-6 w-6 fill-white"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </HLRadioGroup.Option>
            ))}
          </div>
        </HLRadioGroup>
      </div>
    </div>
  );
}

/**
 * SCENARIO:
 * 1- when first use logged in, they should first select a currency.
 * 2- this currency gets saved to localStorage with key of `currency`,
 *  and value of {id, short, long}.
 * 3- when the user wants to add new currency(depend on their role),
 *  a popup will appear to make mutation request to add new currency.
 *  The new added one should be reflected immdiately on the ui level.
 */
