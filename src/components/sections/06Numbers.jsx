import SectionShell from "../layout/SectionShell";
import React, { useEffect, useState } from "react";
import { THEME } from "../../theme";
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

const LegendSquare = ({ color }) => (
  <span
    style={{
      display: "inline-block",
      width: "12px",
      height: "12px",
      backgroundColor: color,
      marginRight: "6px",
      borderRadius: "2px",
    }}
  />
);

export default function NumbersSection({ activeId }) {
  const [rawRows, setRawRows] = useState([]);
  const [labels, setLabels] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(null);

  const colors = [
    "#acbd8b",
    "#6a9582",
    "#bc8e5f",
    "#7a4628",
    "#4a6a7f",
    "#9c4442",
  ];

  const names = ["Bread", "Tea and two Slices", "Coat", "Trousers", "Dormitory", "Income"];

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}Price_Comparison.csv`)
      .then((res) => res.text())
      .then((text) => {
        const rows = text
          .trim()
          .split(/\r?\n/)
          .map((r) => r.split(","));

        const dataRows = rows.slice(1);
        const labels = dataRows.map((r) => r[0]);

        setRawRows(dataRows);
        setLabels(labels);
      });
  }, []);

  // Line Data
  const lineDataComputed =
    rawRows.length > 0
      ? {
          labels,
          datasets: colors.map((color, i) => {
            const isActive = activeLineIndex === i;

            return {
              label: names[i],
              data: rawRows.map((row) => Number(row[i + 1]) || 0),

              borderColor:
                activeLineIndex === null
                  ? color
                  : isActive
                  ? color
                  : color + "33",

              backgroundColor: color,
              borderWidth: isActive ? 4 : 2,
              tension: 0.4,
              pointRadius: isActive ? 4 : 2,
              pointBackgroundColor: color,
            };
          }),
        }
      : null;

 
  // Bar Data
  const barData =
    rawRows.length > 0
      ? {
          labels: ["Income", "Costs"],
          datasets: [
            {
              label: "Income",
              data: [(Number(rawRows[activeIndex]?.[6]) || 0) * 30, 0],
              backgroundColor: "#9c4442",
              stack: "total",
            },
            ...names.slice(0, 5).map((name, i) => {
              const raw = Number(rawRows[activeIndex]?.[i + 1]) || 0;
              const val =
                i === 0 || i === 1 || i === 4 ? raw * 30 : raw;

              return {
                label: name,
                data: [0, val],
                backgroundColor: colors[i],
                stack: "total",
              };
            }),
          ],
        }
      : null;

  
  // Line Options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",

        // legend hover -> context
        onHover: (e, item) => {
          setActiveLineIndex(item.datasetIndex);
        },
        onLeave: () => {
          setActiveLineIndex(null);
        },
      },

      title: {
        display: true,
        text: "Price Trends (1930 - 2026)",
      },
    },

    scales: {
      x: {
        title: {
          display: true,
          text: 'Year', 
          font: { size: 12, weight: 'bold' },
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Daily Value / GBP (£)',
          font: { size: 12, weight: 'bold' },
        }
      }
    },

    interaction: {
      mode: "index",
      intersect: false,
    },

    // Hover year
    onHover: (e, elements) => {
      if (elements.length > 0) {
        setActiveIndex(elements[0].index);
      }
    },
  };

  // Bar Options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Monthly Breakdown (${labels[activeIndex] || ""})`,
      },
    },

    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Category', 
          font: { size: 12, weight: 'bold' }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Monthly Total (£)', 
          font: { size: 12, weight: 'bold' }
        }
      },
    },
  };

  const Context = [
    { title: "Bread", color: colors[0], 
      text: (<>"In the end his perseverance was rewarded, for he picked up <span style={{ color: colors[0], fontWeight: 600 }}>a penny. We bought a large piece of stale bread</span>, and devoured it as we walked."</>),
    },
    { title: "Tea and two Slices", color: colors[1], 
      text: (<>"The <span style={{ color: colors[1], fontWeight: 600 }}>tea-and-two-slices cost threepence halfpenny</span>, leaving me with eight and twopence."</> ),
      },
    { title: "Coat", color: colors[2], 
      text: (<>"'He said:  ''Ere y'are, the best rig-out you ever 'ad. A tosheroon <span style={{ color: colors[2], fontWeight: 600 }}>[half a crown] for the coat</span>, two 'ogs for the trousers, one and a tanner for the boots, and a 'og for the cap and scarf. That's seven bob.'"</>),
    },
    { title: "Trousers", color: colors[3], 
      text: (<>"He said:  ''Ere y'are, the best rig-out you ever 'ad. A tosheroon [half a crown] for the coat, <span style={{ color: colors[3], fontWeight: 600 }}>two 'ogs for the trousers</span>, one and a tanner for the boots, and a 'og for the cap and scarf. That's seven bob.'"</>),
    },
    { title: "Dormitory", color: colors[4], 
      text: (<>"The charge was <span style={{ color: colors[4], fontWeight: 600 }}>ninepence or a shilling</span> (in the shilling dormitory the beds were six feet apart instead of four) and the terms were cash down by seven in the evening or out you went."</>),
     },
    { title: "Income", color: colors[5], 
      text: (<>"Take the year round, I make about <span style={{ color: colors[5], fontWeight: 600 }}>a pound a week</span>, because you can't do much in the winter. Boat Race day, and Cup Final day, I've took as much as four pounds."</>), 
    },
  ];

  return (
    <SectionShell
      id="survival-by-numbers"
      title="Surviving Then and Now"
      intro={
        <>
        What did it mean to survive on the margins?<br />
        This chart compares the cost of basic necessities(food, clothing, and shelter)with income across time.<br /> 
        By linking long-term trends with monthly affordability, it reveals how the struggle described in Orwell's narrative translates into measurable economic pressure.<br />
        The seemingly lower lodging cost in 2026 reflects the limits of simplified estimates, which cannot fully capture the reality of today's rising rents and housing pressures.<br />
        </>
      }
        isActive={activeId === "survival-by-numbers"}
    >
      <div style={{ width: "1000px", margin: "0 auto" }}>
        {/* Charts */}
        <div
          style={{
            height: "400px",
            display: "flex",
            gap: "30px",
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #eee",
          }}
        >
          <div style={{ flex: 8 }}>
            {lineDataComputed && (
              <Line data={lineDataComputed} options={lineOptions} />
            )}
          </div>

          <div
            style={{
              flex: 2,
              maxWidth: "250px",
              borderLeft: "2px solid #eee",
              paddingLeft: "20px",
            }}
          >
            {barData && <Bar data={barData} options={barOptions} />}
          </div>
        </div>

        {/* Context below charts*/}
        <div
          style={{
            marginTop: "20px",

            // Fix size
            height: "100px",
            width: "100%",

            padding: "5px",
            boxSizing: "border-box", 

            backgroundColor: "rgba(255,255,255,0.3)",
            backdropFilter: "blur(6px)",
            borderRadius: "10px",

            borderLeft: `6px solid ${
              activeLineIndex !== null
                ? Context[activeLineIndex].color
                : "#ccc"
            }`,

            display: "flex",
            flexDirection: "column", 

            overflow: "hidden", 
          }}
        >
          {activeLineIndex !== null ? (
            <>
              {/* fix title */}
              <h4
                style={{
                  color: Context[activeLineIndex].color,
                  marginBottom: "5px",
                  flexShrink: 0, 
                }}
              >
                <LegendSquare
                  color={Context[activeLineIndex].color}
                />
                {Context[activeLineIndex].title}
              </h4>

              {/* context */}
              <div
                style={{
                  flex: 1, 
                  display: "flex",
                  alignItems: "center",            
                }}
              >
                <p style={{ fontFamily: THEME.fonts.serif, fontSize: "15px", fontStyle: "italic", margin: 0 }}>
                  {Context[activeLineIndex].text}
                </p>
              </div>
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              Hover legend to see context
            </div>
          )}
        </div>

        {/* Source */}
          <p style={{ fontSize: "0.8rem", color: "#999", marginTop: "6px" }}>
            Source:Prices are adjusted using the{" "}
            <a
              href="https://www.bankofengland.co.uk/monetary-policy/inflation/inflation-calculator"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#4a6a7f", textDecoration: "none" }}
            >
              Bank of England Inflation Calculator
            </a>
          </p>
      </div>
    </SectionShell>
  );
}