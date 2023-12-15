import "./CustomBubbleBarChart.scss";

import React, { useMemo, useState } from "react";

const dummyData = [
  {
    label: "Channel 1",
    bubbleValue: 38,
    bars: [
      { color: "#0072b4", value: 450 },
      { color: "#25beb2", value: 100 },
      { color: "#8b8b8b", value: 50 },
    ],
  },
  {
    label: "Channel 2",
    bubbleValue: 23,
    bars: [
      { color: "#0072b4", value: 400 },
      { color: "#25beb2", value: 100 },
      { color: "#8b8b8b", value: 50 },
    ],
  },
  {
    label: "Channel 3",
    bubbleValue: 13,
    bars: [
      { color: "#0072b4", value: 400 },
      { color: "#25beb2", value: 100 },
      { color: "#8b8b8b", value: 50 },
    ],
  },
  {
    label: "Channel 4",
    bubbleValue: 31,
    bars: [
      { color: "#0072b4", value: 400 },
      { color: "#25beb2", value: 100 },
      { color: "#8b8b8b", value: 50 },
    ],
  },
  {
    label: "Channel 5",
    bubbleValue: 42,
    bars: [
      { color: "#0072b4", value: 400 },
      { color: "#25beb2", value: 100 },
      { color: "#8b8b8b", value: 50 },
    ],
  },
];

export const CustomBubbleBarChart = () => {
  const [data, setData] = useState(dummyData);

  const maxBarValue = useMemo(
    () => Math.max(...data.map((d) => Math.max(...d.bars.map((b) => b.value)))),
    [data]
  );

  const maxBubbleValue = useMemo(
    () => Math.max(...data.map((d) => d.bubbleValue)),
    [data]
  );

  return (
    <div
      className="custom-bubble-bar-chart"
      style={{
        gridTemplateColumns: `repeat(${data.length}, minmax(10em, 1fr))`,
      }}
    >
      <div className="chart-row">
        {data.map((d, i) => (
          <div
            key={i}
            className="bubble-container"
            style={{ gridColumn: i + 1 }}
          >
            <div
              className="bubble"
              style={{ height: `${(d.bubbleValue / maxBubbleValue) * 80}%` }}
            >
              {d.bubbleValue}%
            </div>
          </div>
        ))}

        <div
          className="bubble-line"
          style={{
            "--line-offset": `${100 / (data.length * 2)}%`,
            gridColumnStart: 1,
            gridColumnEnd: data.length + 1,
          }}
        ></div>
      </div>

      <div className="chart-row">
        {data.map((item, i) => {
          const itemMaxBarValue = Math.max(...item.bars.map((b) => b.value));

          return (
            <div key={i} className="bar-container">
              <div
                className="bar-wrapper"
                style={{ height: `${(itemMaxBarValue / maxBarValue) * 100}%` }}
              >
                {item.bars.map((b, j) => (
                  <div
                    key={j}
                    className="bar"
                    style={{
                      backgroundColor: b.color,
                      height: `${(b.value / itemMaxBarValue) * 100}%`,
                    }}
                  >
                    <span>{b.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="chart-row">
        {data.map((d, i) => (
          <div key={i} className="label-container">
            <span>{d.label}</span>
            <span>&#11208;</span>
          </div>
        ))}
      </div>
    </div>
  );
};
