import React from "react";
import { Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CURRENCIES } from "src/constants";
import { Icon } from "@components/icons";
import { useRouter } from "next/router";
import { useLocalStorage } from "@lib/helpers/hooks";
import { ar, en } from "@locales";
import { Spinner } from "@components/ui";
import { Currency as TCurrency } from "@prisma/client";

type CurrencyProps = {
  isLoading: boolean;
  onConfirm: (name: string) => Promise<{ addCurrency: TCurrency }>;
};
export default function Currency({ isLoading, onConfirm }: CurrencyProps) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [_, setCurrency] = useLocalStorage("currency", {});
  const { locale } = useRouter();
  const translation = locale === "en" ? en : ar;
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
    <Combobox
      value={selected}
      onChange={(curr) => {
        setSelected(curr);
      }}
    >
      <div className="relative flex flex-col gap-6 my-auto">
        <h1 className="ltr:text-left rtl:text-right capitalize font-semibold text-2xl">
          {translation.currency.title}
        </h1>

        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white border focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className={`w-full border-none ${
              locale === "en" ? "pl-3 pr-10" : "pl-10 pr-3"
            } py-2 text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none`}
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(curr: typeof selected) => curr[1]}
          />
          <Combobox.Button
            className={`absolute inset-y-0 ${
              locale === "en" ? "pr-2 right-0" : "pl-2 left-0"
            }  flex items-center `}
          >
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
        <button
          onClick={async () => {
            const { addCurrency } = await onConfirm(selected[0]);
            setCurrency({
              id: addCurrency.id,
              short: selected[0],
              long: selected[1],
            });
          }}
          className="h-10 grid place-items-center rounded-lg bg-white capitalize shadow-3D"
        >
          {!isLoading ? translation.currency.button : <Spinner />}
        </button>
      </div>
    </Combobox>
  );
}
