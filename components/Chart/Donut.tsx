import React from "react";
import { PieChart } from "react-minimal-pie-chart";

const initialData = [{ key: 0, value: 0 }];

const Donut: React.FC = ({ data, donutInnerLabel }) => {
  return (
    <div>
      <PieChart
        data={data.length === 0 ? initialData : data}
        animate
        lineWidth={40}
        background="#bfbfbf"
        className="h-[200px]"
        label={({ dataEntry }) => {
          return (
            <switch key={dataEntry.key}>
              <foreignObject
                x="25"
                y="30"
                dx={0}
                dy={0}
                className="h-[40px] w-[50px] text-[7px] text-center text-gray-500"
              >
                <p
                  className="flex justify-center items-center h-full max-w-full leading-tight"
                  xmlns="http://www.w3.org/1999/xhtml"
                >
                  {donutInnerLabel}
                </p>
              </foreignObject>
              <text x="50" y="50">
                Your SVG viewer cannot display html.
              </text>{" "}
            </switch>
          );
        }}
      />
    </div>
  );
};

export default Donut;
