import { useAppSelector } from "@app/hooks";
import { CurrencyState, selectCurrentCurrency } from "@features/currency";
import { useLocalStorage } from "@lib/helpers/hooks";
import { ar, en } from "@locales";
import { useRouter } from "next/router";

type P = {
  amount: number;
  [k: string]: any;
};

const DisplayAmount: React.FC<P> = ({ amount, ...style }) => {
  const { locale } = useRouter();
  const currency = useAppSelector(selectCurrentCurrency);
  const [crncLS, _] = useLocalStorage<CurrencyState>("currency", {
    id: "",
    short: "",
    long: "",
  });
  const translation = locale === "en" ? en : ar;
  const renderedCurrency =
    translation.currency.codes[
      (currency.short || crncLS.short) as keyof typeof translation.currency.codes
    ];
  const renderedAmount = Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
  })
    .format(Number(amount))
    .concat(` ${renderedCurrency}`);

  // console.log({ currency });

  return <span {...style}>{renderedAmount}</span>;
};

export default DisplayAmount;
