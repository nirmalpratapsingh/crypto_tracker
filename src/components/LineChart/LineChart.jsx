import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

const LineChart = ({ historicalData, currency }) => {
  const [data, setData] = useState([["Date", "Price"]]);

  useEffect(() => {
    // Safeguard: only run if historicalData and prices exist
    if (!historicalData?.prices) return;

    const dataCopy = [["Date", "Price"]];
    const prices = historicalData.prices;

    // Reduce number of points to ~50 for faster rendering
    const step = Math.ceil(prices.length / 50);

    prices.forEach((item, index) => {
      if (index % step === 0) {
        const date = new Date(item[0]).toLocaleDateString();
        const price = item[1];
        dataCopy.push([date, price]);
      }
    });

    setData(dataCopy);
  }, [historicalData]);

  // Show spinner while data is loading
  if (!historicalData?.prices) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  return (
    <Chart
      chartType="LineChart"
      data={data}
      width="100%"
      height="400px"
      options={{
        hAxis: { title: "Date" },
        vAxis: { title: `Price (${currency?.symbol || "$"})` },
        legend: { position: "bottom" },
        pointSize: 5,
      }}
      loader={
        <div className="spinner">
          <div className="spin"></div>
        </div>
      }
    />
  );
};

export default LineChart;
