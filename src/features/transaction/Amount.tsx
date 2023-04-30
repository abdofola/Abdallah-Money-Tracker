import { useRouter } from "next/router";

type P = {
  amount: number;
  [k: string]: any;
};

const DisplayAmount: React.FC<P> = ({ amount, ...style }) => {
  const { locale } = useRouter();
  const currency = locale === "en" ? "SDG" : "ج";
  const renderedAmount = Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
  })
    .format(Number(amount))
    .concat(` ${currency}`);

  return <span {...style}>{renderedAmount}</span>;
};

export default DisplayAmount;
