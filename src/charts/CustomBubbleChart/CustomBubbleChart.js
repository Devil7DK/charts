import "./CustomBubbleChart.scss";

import React, { useMemo, useState } from "react";

const dummyData = [
  { x: "Brand 1", y: "Channel 1", value: 310 },
  { x: "Brand 1", y: "Channel 2", value: 310 },
  { x: "Brand 1", y: "Channel 3", value: 339 },
  { x: "Brand 1", y: "Channel 4", value: 331 },
  { x: "Brand 1", y: "Channel 5", value: 234 },
  { x: "Brand 1", y: "Channel 6", value: 764 },
  { x: "Brand 2", y: "Channel 1", value: 873 },
  { x: "Brand 2", y: "Channel 2", value: 873 },
  { x: "Brand 2", y: "Channel 3", value: 339 },
  { x: "Brand 2", y: "Channel 4", value: 331 },
  { x: "Brand 2", y: "Channel 5", value: 456 },
  { x: "Brand 2", y: "Channel 6", value: 345 },
  { x: "Brand 3", y: "Channel 1", value: 873 },
  { x: "Brand 3", y: "Channel 2", value: 873 },
  { x: "Brand 3", y: "Channel 3", value: 339 },
  { x: "Brand 3", y: "Channel 4", value: 331 },
  { x: "Brand 3", y: "Channel 5", value: 456 },
  { x: "Brand 3", y: "Channel 6", value: 345 },
  { x: "Brand 4", y: "Channel 1", value: 873 },
  { x: "Brand 4", y: "Channel 2", value: 873 },
  { x: "Brand 4", y: "Channel 3", value: 339 },
  { x: "Brand 4", y: "Channel 4", value: 331 },
  { x: "Brand 4", y: "Channel 5", value: 456 },
  { x: "Brand 4", y: "Channel 6", value: 345 },
  { x: "Brand 5", y: "Channel 1", value: 873 },
  { x: "Brand 5", y: "Channel 2", value: 873 },
  { x: "Brand 5", y: "Channel 3", value: 339 },
  { x: "Brand 5", y: "Channel 4", value: 331 },
  { x: "Brand 5", y: "Channel 5", value: 456 },
  { x: "Brand 5", y: "Channel 6", value: 345 },
  { x: "Brand 6", y: "Channel 1", value: 873 },
  { x: "Brand 6", y: "Channel 2", value: 873 },
  { x: "Brand 6", y: "Channel 3", value: 339 },
  { x: "Brand 6", y: "Channel 4", value: 331 },
  { x: "Brand 6", y: "Channel 5", value: 456 },
  { x: "Brand 6", y: "Channel 6", value: 345 },
  { x: "Brand 7", y: "Channel 1", value: 873 },
  { x: "Brand 7", y: "Channel 2", value: 873 },
  { x: "Brand 7", y: "Channel 3", value: 339 },
  { x: "Brand 7", y: "Channel 4", value: 331 },
  { x: "Brand 7", y: "Channel 5", value: 456 },
  { x: "Brand 7", y: "Channel 6", value: 345 },
];

export const CustomBubbleChart = () => {
  const [data, setData] = useState(dummyData);

  const xAxisLabels = useMemo(
    () =>
      Array.isArray(data)
        ? data
            .map((item) => item.x)
            .filter((item, index, array) => array.indexOf(item) === index)
        : [],
    [data]
  );

  const yAxisLabels = useMemo(
    () =>
      Array.isArray(data)
        ? data
            .map((item) => item.y)
            .filter((item, index, array) => array.indexOf(item) === index)
        : [],
    [data]
  );

  const xyValueMap = useMemo(
    () =>
      Array.isArray(data) && data.length
        ? data.reduce((obj, item) => {
            obj[item.x] = obj[item.x] || {};

            obj[item.x][item.y] = item.value;

            return obj;
          }, {})
        : {},
    [data]
  );

  const maxValue = useMemo(
    () =>
      Array.isArray(data) && data.length
        ? data.reduce((max, item) => Math.max(max, item.value), 0)
        : 0,
    [data]
  );

  return (
    <div
      className="custom-bubble-chart"
      style={{
        gridTemplateColumns: `auto repeat(${xAxisLabels.length}, 1fr)`,
        gridTemplateRows: `repeat(${yAxisLabels.length}, 1fr) auto`,
      }}
    >
      {yAxisLabels.map((yAxisLabel, yAxisIndex) => (
        <div className="chart-row">
          <div
            className="chart-label y-axis"
            style={{ gridRow: yAxisIndex + 1, gridColumn: 1 }}
          >
            {yAxisLabel}
          </div>
          {xAxisLabels.map((xAxisLabel, xAxisIndex) => (
            <>
              <div
                className="chart-bubble-container"
                style={{ gridRow: yAxisIndex + 1, gridColumn: xAxisIndex + 2 }}
              >
                <div
                  className="chart-bubble"
                  style={{
                    height: `${
                      ((xyValueMap[xAxisLabel][yAxisLabel] || 0) / maxValue) *
                      80
                    }%`,
                  }}
                >
                  {xyValueMap[xAxisLabel][yAxisLabel]}
                </div>
              </div>

              {xAxisIndex === 0 && (
                <div
                  className="chart-line"
                  style={{
                    gridRow: yAxisIndex + 1,
                    gridColumnStart: 2,
                    gridColumnEnd: xAxisLabels.length + 2,
                  }}
                ></div>
              )}
            </>
          ))}
        </div>
      ))}

      <div className="chart-row">
        <div className="chart-label"></div>
        {xAxisLabels.map((xAxisLabel) => (
          <div className="chart-label x-axis">{xAxisLabel}</div>
        ))}
      </div>
    </div>
  );
};
