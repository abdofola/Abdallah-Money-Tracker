import React from "react";
import { PieChart } from "react-minimal-pie-chart";
import ReactTooltip from "react-tooltip";
import { TransactionElement } from "@features/transaction/types";
import { useRouter } from "next/router";

type DonutProps = {
  data: TransactionElement[];
  donutInnerLabel: React.ReactNode;
};

const initialData = [{ key: 0, value: 0 }];
const makeTooltipContent = (entry: any, local = "ar") => {
  return local === "en"
    ? `Sector ${entry.category.name[local]} has value ${entry.value}`
    : `${entry.value} مبلغ  ال${entry.category.name[local]}`;
};

const Donut: React.FC<DonutProps> = ({ data, donutInnerLabel }) => {
  const [hover, setHover] = React.useState<null | number>(null);
  const { locale } = useRouter();

  return (
    <div data-tip="" data-for="chart">
      <PieChart
        data={data.length === 0 ? initialData : data}
        animate
        lineWidth={40}
        background="#bfbfbf"
        className="h-[200px]"
        label={({ dataEntry }) => {
          return (
            // <switch key={dataEntry.key}>
            <foreignObject
              x="25"
              y="30"
              dx={0}
              dy={0}
              className="h-[40px] w-[50px] text-[7px] text-center text-gray-500"
            >
              <span className="flex justify-center items-center h-full max-w-full leading-tight">
                {donutInnerLabel}
              </span>
            </foreignObject>
            // </switch>
          );
        }}
        onMouseOver={(_, segmentIdx) => setHover(segmentIdx)}
        onMouseOut={() => setHover(null)}
      />
      <ReactTooltip
        id="chart"
        getContent={() => {
          return typeof hover === "number"
            ? makeTooltipContent(data[hover], locale)
            : null;
        }}
      />
    </div>
  );
};

export default Donut;
