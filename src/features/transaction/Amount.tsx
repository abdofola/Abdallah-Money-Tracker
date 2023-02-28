import { useRouter } from "next/router";

const DisplayAmount: React.FC<{
  amount: number;
  [k: string]: any;
}> = ({ amount, ...style }) => {
  const { locale } = useRouter();
  const currency = locale === "en" ? "SDG" : "ج";
  const renderedAmount = Number(amount)
    .toFixed(2)
    .toString()
    .concat(` ${currency}`);

  return <span {...style}>{renderedAmount}</span>;
};

export default DisplayAmount;
