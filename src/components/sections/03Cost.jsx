import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useSpendingData } from "../finance/useSpendingData";
import SectionShell from "../layout/SectionShell";

const COLORS = ["#2c2c2c", "#a0a0a0"];

const CATEGORY_ICONS = {
  Accomodation: "🏠",
  Food: "🍞",
};

export default function CostSection({ activeId }) {
  const { dailyData, categoryData } = useSpendingData();

  const total = categoryData.reduce((sum, c) => sum + c.value, 0);

  return (
    <SectionShell
      id="cost-of-survival"
      title="The Cost of Survival"
      intro="This section traces everyday expenses — food, lodging, transport — revealing how survival is structured through spending patterns."
      isActive={activeId === "cost-of-survival"}
    >
  
      <div style={{ display: "flex", gap: "3rem", marginTop: "2rem", alignItems: "flex-start" }}>

        {/* LEFT COLUMN — Daily Expenses */}
        <div style={{ flex: 1, maxHeight: "600px", overflowY: "auto" }}>
          <h3 style={{ marginBottom: "1rem" }}>Day by Day</h3>

          {dailyData.map((day, index) => {
            // Compare closing balance with previous day
            const prevBalance = index > 0 ? dailyData[index - 1].closingBalance : 0;
            const balanceWentUp = day.closingBalance >= prevBalance;

            return (
              <div key={day.day}>

                {/* Day header */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f0ede6",
                  padding: "0.4rem 0.8rem",
                  marginBottom: "0.25rem",
                  fontSize: "0.85rem",
                  color: "#555",
                }}>
                  <span>{day.day}</span>

                  {/* Balance indicator */}
                  <span style={{
                    color: balanceWentUp ? "#2c7a2c" : "#b03030",
                    fontWeight: "600",
                  }}>
                    {balanceWentUp ? "▲" : "▼"} Balance: £{day.closingBalance.toFixed(3)}
                  </span>
                </div>

                {/* Items */}
                {day.items.map((item, i) => (
                  <div key={i} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.6rem 0.8rem",
                    borderBottom: "1px solid #e8e4dc",
                    backgroundColor: item.isSaving ? "#f7fcf7" : "transparent",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "1.2rem" }}>
                        {CATEGORY_ICONS[item.category] || "📌"}
                      </span>
                      <div>
                        <div style={{ fontSize: "0.9rem", fontWeight: "500" }}>
                          {item.action}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#888" }}>
                          {item.place}, {item.neighbourhood}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: item.isSaving ? "#2c7a2c" : "#b03030",
                      }}>
                        {item.isSaving ? "+" : "-"} £{item.amount.toFixed(3)}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#aaa" }}>
                        {item.original}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN — Donut Chart */}
        <div style={{ width: "320px", flexShrink: 0 }}>
          <h3 style={{ marginBottom: "1rem" }}>Spending by Category</h3>

          {/* Donut */}
          <div style={{ position: "relative", width: "100%", height: "280px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`£${value.toFixed(3)}`, ""]} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center total */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}>
              <div style={{ fontSize: "1.4rem", fontWeight: "700" }}>
                £{total.toFixed(3)}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#888" }}>total spent</div>
            </div>
          </div>

          {/* Legend */}
          {categoryData.map((cat, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.75rem 0",
              borderBottom: "1px solid #e8e4dc",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: COLORS[i % COLORS.length],
                }} />
                <span style={{ fontSize: "0.9rem" }}>
                  {CATEGORY_ICONS[cat.name] || "📌"} {cat.name}
                </span>
              </div>
              <span style={{ fontSize: "0.9rem", fontWeight: "600" }}>
                £{cat.value.toFixed(3)}
              </span>
            </div>
          ))}
        </div>

      </div>
    </SectionShell>
  );
}