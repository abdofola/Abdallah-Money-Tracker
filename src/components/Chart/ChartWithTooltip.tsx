import React from "react";
import { PieChart } from "react-minimal-pie-chart";
import ReactTooltip from "react-tooltip";

const makeTooltipContent = (entry: any) =>
  `Sector ${entry.tooltip} has value ${entry.value}`;

const ChartWithTooltip: React.FC<any> = ({ transactions, name }) => {
  // const [visible, setVisible] = React.useState({
  //   income: true,
  //   expense: true,
  // });
  // const [hover, setHover] = React.useState<null | number>(null);
  // const shiftSize = 0.5;
  // const cubicBezier = "cubic-bezier(.29, 1.01, 1, -0.68)";
  // const style = {
  //   fontSize: "7px",
  //   fontFamily: "sans-serif",
  // };
  // const normalized = transactions.reduce((acc:any, curr:any) => {
  //   const { name, amount, color } = curr;

  //   if (!(name in acc)) acc[name] = new Map();

  //   if (acc[name].has("amount"))
  //     acc[name].set("amount", Number(amount) + acc[name].get("amount"));
  //   else acc[name].set("amount", Number(amount));

  //   acc[name].set("color", color);

  //   return acc;
  // }, {});
  // const data = Object.entries(normalized).map(([key, value], idx) => ({
  //   key: safeId(key, idx),
  //   title: key,
  //   value: value.get("amount"),
  //   color: value.get("color") ?? "gray",
  //   tooltip: key,
  // }));
  // const text = visible[name] ? `hide ${name}` : `show ${name}`;

  // const toggleChartVisibility = (name: MyChart["name"]) => () =>
  //   setVisible({ ...visible, [name]: !visible[name] });

  return (
    <div data-tip="" data-for="chart" className={styles.chart}>
      <>
        <button
          className={styles.chart__title}
          onClick={toggleChartVisibility(name)}
        >
          {text} chart
        </button>
        {visible[name] && (
          <div className="sm:px-4">
            <PieChart
              animate
              radius={PieChart.defaultProps.radius - shiftSize}
              lineWidth={50}
              labelPosition={75}
              animationEasing={cubicBezier}
              label={({ x, y, dx, dy, dataEntry }) => (
                <text
                  key={dataEntry.key}
                  x={x}
                  y={y}
                  dx={dx}
                  dy={dy}
                  dominantBaseline="central"
                  textAnchor="middle"
                  style={style}
                >
                  {Math.round(dataEntry.percentage) + "%"}
                </text>
              )}
              labelStyle={style}
              segmentsShift={() => shiftSize}
              data={data}
              onMouseOver={(_, segmentIdx) => setHover(segmentIdx)}
              onMouseOut={() => setHover(null)}
            />
            <ReactTooltip
              id="chart"
              getContent={() => {
                return typeof hover === "number"
                  ? makeTooltipContent(data[hover])
                  : null;
              }}
            />
            <ul className={styles.chart__indicators}>
              {data.map(({ title, color }) => (
                <li key={title} className={styles.chart__indicator}>
                  <span
                    className="inline-block w-3 h-3 self-end rounded-full"
                    style={{ backgroundColor: `${color}` }}
                  />
                  <span>{title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    </div>
  );
};

export default ChartWithTooltip;
