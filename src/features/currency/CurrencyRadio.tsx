import React from "react";
import { Icon } from "@components/icons";
import { RadioGroup as HLRadioGroup } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "@app/hooks";
import { useLocalStorage } from "@lib/helpers/hooks";
import { selectCurrentCurrency, setCurrency } from "./currencySlice";
import { CURRENCIES } from "src/constants";
import type { CurrencyState } from "./currencySlice";
import type { Currency } from "@prisma/client";

type CurrencyRadioProps = {
  currencies: Currency[];
};

export default function CurrencyRadio({ currencies }: CurrencyRadioProps) {
  const dispatch = useAppDispatch();
  const currency = useAppSelector(selectCurrentCurrency);
  const [curcLS, _] = useLocalStorage<CurrencyState>("currency", {
    id: "",
    short: "",
    long: "",
  });
  const [selected, setSelected] = React.useState(() => {
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
                  ${
                    checked ? "bg-sky-900 bg-opacity-75 text-white" : "bg-white"
                  }
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
