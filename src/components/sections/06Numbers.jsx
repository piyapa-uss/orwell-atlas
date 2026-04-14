import SectionShell from "../layout/SectionShell";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function NumbersSection({ activeId }) {
  const [chartData, setChartData] = useState(null);

  const totalDuration = 10000;
  const dataLength = chartData ? chartData.labels.length : 0;
  const delayBetweenPoints = dataLength ? totalDuration / dataLength : 0;

  const previousY = (ctx) =>
    ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(0)
      : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1]
          .getProps(["y"], true).y;

  const animation = {
    x: {
      type: "number",
      easing: "linear",
      duration: delayBetweenPoints,
      from: NaN,
      delay(ctx) {
        if (ctx.type !== "data" || ctx.xStarted) return 0;
        ctx.xStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
    y: {
      type: "number",
      easing: "linear",
      duration: delayBetweenPoints,
      from: previousY,
      delay(ctx) {
        if (ctx.type !== "data" || ctx.yStarted) return 0;
        ctx.yStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
  };

  useEffect(() => {
  fetch(`${import.meta.env.BASE_URL}Price_Comparison.csv`)
    .then(res => {
      if (!res.ok) throw new Error("CSV not found");
      return res.text();
    })
    .then(text => {
      const rows = text
        .trim()
        .split(/\r?\n/)
        .map(r => r.split(","))
        .filter(row => row.length > 1);

      const headers = rows[0];
      const dataRows = rows.slice(1);

      const labels = dataRows.map(row => row[0]);

      const datasets = headers.slice(1).map((col, i) => ({
        label: col,
        data: dataRows.map(row => {
          const value = Number(row[i + 1]);
          return isNaN(value) ? null : value;
        }),
        borderWidth: 2,
        tension: 0.3,
      }));

      setChartData({ labels, datasets });
    })
    .catch(err => console.error("CSV ERROR:", err));
}, []);

  const options = {
    responsive: true,
    animation,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Price Comparison Over Time",
      },
    },
  };

  return (
    <SectionShell
      id="survival-by-numbers"
      title="Surviving Then and Now: A Comparison of Living Costs"
      intro="compares the prices of essential goods alongside wages across different years."
      isActive={activeId === "survival-by-numbers"}
    >
      {/* CONTENT START */}

      <div style={{ marginTop: "20px" }}>
        {chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>

      <p style={{ marginTop: "10px", opacity: 0.7 }}>
        The chart compares the changing costs of essential goods, revealing how survival expenses evolve over time.
      </p>

      {/* CONTENT END */}
    </SectionShell>
  );
}