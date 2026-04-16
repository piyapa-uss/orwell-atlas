import SectionShell from "../layout/SectionShell";
import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function NumbersSection({ activeId }) {
  const [lineData, setLineData] = useState(null);
  const [rawRows, setRawRows] = useState([]);
  const [labels, setLabels] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}Price_Comparison.csv`)
      .then((res) => {
        if (!res.ok) throw new Error("CSV not found");
        return res.text();
      })
      .then((text) => {
        const rows = text
          .trim()
          .split(/\r?\n/)
          .map((r) => r.split(","))
          .filter((row) => row.length > 1);

        const headers = rows[0];
        const dataRows = rows.slice(1);
        const labels = dataRows.map((row) => row[0]);

        const colors = [
          "#acbd8b",
          "#6a9582",
          "#bc8e5f",
          "#7a4628",
          "#4a6a7f",
          "#9c4442",
        ];

        // line chart data
        const lineDatasets = headers.slice(1).map((col, i) => {
          const color = colors[i % colors.length];
          return {
            label: col,
            data: dataRows.map((row) => Number(row[i + 1]) || 0),
            borderColor: color,
            backgroundColor: color,
            pointBackgroundColor: color,
            borderWidth: 2,
            tension: 0.45,
          };
        });

        setLineData({
          labels,
          datasets: lineDatasets,
        });

        setLabels(labels);
        setRawRows(dataRows);
      })
      .catch((err) => console.error(err));
  }, []);

  // Bar chart data
  const barData =
    rawRows.length > 0
      ? {
          labels: ["Income", "Costs"],
          datasets: [
            {
              label: "Income",
              data: [Number(rawRows[activeIndex]?.[5]) || 0, 0],
              backgroundColor: "#9c4442",
              stack: "total",
            },
            {
              label: "Bread",
              data: [0, Number(rawRows[activeIndex]?.[1]) || 0],
              backgroundColor: "#acbd8b",
              stack: "total",
            },
            {
              label: "Tea",
              data: [0, Number(rawRows[activeIndex]?.[2]) || 0],
              backgroundColor: "#6a9582",
              stack: "total",
            },
            {
              label: "Coat",
              data: [0, Number(rawRows[activeIndex]?.[3]) || 0],
              backgroundColor: "#bc8e5f",
              stack: "total",
            },
            {
              label: "Trousers",
              data: [0, Number(rawRows[activeIndex]?.[4]) || 0],
              backgroundColor: "#7a4628",
              stack: "total",
            },
            {
              label: "Lodging",
              data: [0, Number(rawRows[activeIndex]?.[5]) || 0],
              backgroundColor: "#4a6a7f",
              stack: "total",
            },
          ],
        }
      : null;

  // line chat year
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Price Trends Over Time",
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    // move on line chart
    onHover: (event, elements) => {
      if (elements.length > 0) {
        setActiveIndex(elements[0].index);
      }
    },
  };

  // Bar chart
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `(${labels[activeIndex] || ""})`,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <SectionShell
      id="survival-by-numbers"
      title="Surviving Then and Now"
      intro="Comparing income and cost structure across time."
      isActive={activeId === "survival-by-numbers"}
    >
      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "20px",
          alignItems: "flex-end", // Bottom alignment
        }}
      >
        {/* Line chart */}
        <div style={{ flex: 9 }}>
          {lineData ? (
            <Line data={lineData} options={lineOptions} />
          ) : (
            <p>Loading line chart...</p>
          )}
        </div>

        {/* Bar chart */}
        <div
          style={{
            flex: 1,
            borderLeft: "2px solid #f0f0f0", 
            paddingLeft: "20px",
          }}
        >
          {barData ? (
            <div style={{ height: "100%", width: "100%" }}>
              <Bar data={barData} options={barOptions} />
              <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#666" }}>
                Income vs Cost Details
              </p>
            </div>
          ) : (
            <p>Loading bar chart...</p>
          )}
        </div>
      </div>
    </SectionShell>
  );
}