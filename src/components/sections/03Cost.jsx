// Recharts components for creating donut chart visualization
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
// Custom hook to fetch and process daily spending and category data
import { useSpendingData } from "../finance/useSpendingData";
// Layout wrapper component for consistent section styling
import SectionShell from "../layout/SectionShell";
// Application theme with colors, fonts, and styling constants
import { THEME } from "../../theme.js";

// Color palette for donut chart segments
const COLORS = [THEME.colors.ink, THEME.colors.stone];

// Emoji icons for spending categories
const CATEGORY_ICONS = {
  Accommodation: "🏠",
  Food: "🍞",
};

/**
 * CostSection Component
 * Displays daily spending transactions and category-based spending breakdown
 * Uses a two-column layout: left for daily details, right for donut chart
 * @param {string} activeId - ID of currently active section for navigation highlighting
 */
export default function CostSection({ activeId }) {
  // Fetch spending data from custom hook
  const { dailyData, categoryData } = useSpendingData();

  // Calculate total spending across all categories
  const total = categoryData.reduce((sum, c) => sum + c.value, 0);

  return (
    <SectionShell
      id="cost-of-survival"
      title="Orwell's Bank App: The Cost of Survival"
      intro="Trace author's expenses across London revealing how surviving was like. In which items did he spend his scarce pennies? How much things cost back then? What was his daily budget? How did he manage to get by? Explore how money shapes poor people experience in the city."
      isActive={activeId === "cost-of-survival"}
    >
      {/* Main container: two-column layout (flexbox) */}
      <div style={{
        display: "flex",
        gap: "3rem",
        alignItems: "flex-start",
        width: "100%",
        maxWidth: "1100px",
        margin: "2rem auto 0 auto",
        justifyContent: "center",
      }}>

        {/* LEFT COLUMN — Daily Expenses: Scrollable list of transactions */}
        <div style={{ flex: 1, maxHeight: "600px", overflowY: "auto" }}>
          <h3 style={{
            marginBottom: "1rem",
            fontFamily: THEME.fonts.serif,
            fontSize: "1.8rem",
            fontWeight: "400",
          }}>
            Day by Day
            <span style={{
              fontFamily: THEME.fonts.sans,
              fontSize: "0.8rem",
              fontWeight: "400",
              color: THEME.colors.muted,
              marginLeft: "0.6rem",
              fontStyle: "italic",
            }}>
              (in £ / £sd system)
            </span>
          </h3>

          {/* Loop through each day's transactions */}
          {dailyData.map((day, index) => {
            // Determine if balance increased or decreased compared to previous day
            const prevBalance = index > 0 ? dailyData[index - 1].closingBalance : 0;
            const balanceWentUp = day.closingBalance >= prevBalance;

            return (
              <div key={day.day}>

                {/* Day header with day name and balance */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: THEME.colors.surface,
                  padding: "0.6rem 0.8rem",
                  marginTop: "1rem",
                  marginBottom: "0.25rem",
                  borderLeft: `3px solid ${THEME.colors.stone}`,
                }}>
                  {/* Display day of week */}
                  <span style={{
                    fontFamily: THEME.fonts.serif,
                    fontSize: "1rem",
                    fontStyle: "italic",
                    color: THEME.colors.muted,
                  }}>
                    {day.day}
                  </span>

                  {/* Show balance with up/down indicator and color coding */}
                  <span style={{
                    fontFamily: THEME.fonts.sans,
                    fontSize: "0.82rem",
                    fontWeight: "600",
                    letterSpacing: "0.03em",
                    color: balanceWentUp ? "#1b4d3f" : THEME.colors.accent,
                  }}>
                    {balanceWentUp ? "▲" : "▼"} Balance: £{day.closingBalance.toFixed(2)}
                  </span>
                </div>

                {/* List of individual transactions for this day */}
                {day.items.map((item, i) => (
                  <div key={i} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.6rem 0.8rem",
                    borderBottom: `1px solid ${THEME.colors.line}`,
                    backgroundColor: "transparent",
                  }}>
                    {/* Transaction details: icon, action, and location */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {/* Category emoji icon */}
                      <span style={{ fontSize: "1.2rem" }}>
                        {CATEGORY_ICONS[item.category] || "📌"}
                      </span>
                      <div>
                        {/* Transaction action/description */}
                        <div style={{
                          fontFamily: THEME.fonts.serif,
                          fontSize: "1rem",
                          fontWeight: "500",
                        }}>
                          {item.action}
                        </div>
                        {/* Location and neighbourhood */}
                        <div style={{
                          fontFamily: THEME.fonts.sans,
                          fontSize: "0.75rem",
                          color: THEME.colors.muted,
                        }}>
                          {item.place}, {item.neighbourhood}
                        </div>
                      </div>
                    </div>
                    {/* Amount and original price */}
                    <div style={{ textAlign: "right" }}>
                      {/* Amount with sign (+ for savings, - for spending) */}
                      <div style={{
                        fontFamily: THEME.fonts.sans,
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: item.isSaving ? "#1b4d3f" : THEME.colors.accent,
                      }}>
                        {item.isSaving ? "+" : "-"} £{item.amount.toFixed(2)}
                      </div>
                      {/* Original value (e.g., original price before spending) */}
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

        {/* RIGHT COLUMN — Spending Summary: Donut chart and category breakdown */}
        <div style={{ flex: 1, maxHeight: "600px" }}>
          <h3 style={{
            marginBottom: "1rem",
            fontFamily: THEME.fonts.serif,
            fontSize: "1.8rem",
            fontWeight: "400",
          }}>
            Spending by Category
          </h3>

          {/* Donut chart container with centered total */}
          <div style={{ position: "relative", width: "100%", height: "480px" }}>
            {/* Responsive Recharts donut chart */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={130}
                  outerRadius={190}
                  dataKey="value"
                  strokeWidth={0}
                  paddingAngle={3}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  isAnimationActive={true}
                  tabIndex={-1}
                  style={{ outline: "none" }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                     key={index} 
                     fill={
                        entry.name === "Accommodation"
                           ? "#4a6a7f"   
                           : entry.name === "Food"
                           ? "#acbd8b"   
                           : "#ccc"      
                      } 
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center overlay: total spending amount */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none",
            }}>
              {/* Total spending amount */}
              <div style={{
                fontSize: "1.6rem",
                fontWeight: "700",
                fontFamily: THEME.fonts.serif,
              }}>
                £{total.toFixed(2)}
              </div>
              {/* Label for total */}
              <div style={{
                fontSize: "0.75rem",
                color: THEME.colors.muted,
                fontFamily: THEME.fonts.sans,
              }}>
                Total Spent
              </div>
            </div>
          </div>

          {/* Legend: Category breakdown with icons, names, and amounts */}
          {/* Render each spending category as a legend item */}
          {categoryData.map((cat, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.75rem 0",
              borderBottom: `1px solid ${THEME.colors.line}`,
            }}>
              {/* Color swatch and category name */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {/* Colored circle matching chart segment */}
                <div style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: COLORS[i % COLORS.length],
                }} />
                {/* Category emoji and name */}
                <span style={{
                  fontSize: "0.9rem",
                  fontFamily: THEME.fonts.sans,
                  color: THEME.colors.ink,
                }}>
                  {CATEGORY_ICONS[cat.name] || "📌"} {cat.name}
                </span>
              </div>
              {/* Amount spent in this category */}
              <span style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                fontFamily: THEME.fonts.sans,
                color: THEME.colors.ink,
              }}>
                £{cat.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

      </div>

      <div style={{
        maxWidth: "1100px",
        margin: "3rem auto 0 auto",
        padding: "1.5rem 2rem",
        borderTop: `1px solid ${THEME.colors.line}`,
        fontFamily: THEME.fonts.sans,
        fontSize: "0.78rem",
        lineHeight: "1.6",
        color: THEME.colors.muted,
        fontStyle: "normal",
        textAlign: "center",
      }}>
        Note: All prices in Down and Out in London and Paris are expressed in the old British <a href="https://www.royalmintmuseum.org.uk/journal/history/pounds-shillings-and-pence/" style={{ color: "#4a6a7f" }}>pre-decimal currency system</a>. However, this app translated the to the decimal pound system using <a href="https://www.bankofengland.co.uk/education/education-resources/shillings-to-pounds-converter" style={{ color: "#4a6a7f" }}>Bank of England Calculator</a> so as to improve interpretation. All data shown here corresponds strictly to items the author explicitly mentioned consuming or spending on. Actual expenditures may have been higher (indeed, there is week gap within the story), but no records remain of those. After all, money laundering and tax evasion has been a common practice in The City since the beginnings of time.
      </div>

    </SectionShell>
  );
}