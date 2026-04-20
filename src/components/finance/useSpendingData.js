import { useState, useEffect } from "react";
import Papa from "papaparse";
import dailyCSV from "../../data/savings_spenditure.csv?raw";
import categoriesCSV from "../../data/spending_categories.csv?raw";

export function useSpendingData() {
  const [dailyData, setDailyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    // Parse main CSV
    const parsed = Papa.parse(dailyCSV, {
      header: true,
      delimiter: ";",
      skipEmptyLines: true,
    });

    // Group by day
    const grouped = {};
    parsed.data.forEach((row) => {
      const day = row["Day"]?.trim();
      const spending = parseFloat(row["Spending (Decimal Pounds System)"]?.trim().replace(",", ".")) || 0;
      const savings = parseFloat(row["Savings (Decimal Pounds System)"]?.trim().replace(",", ".")) || 0;
      const netSavings = parseFloat(row["Net Savings"]?.trim().replace(",", ".")) || 0;
      const category = row["Category"]?.trim();

      if (!grouped[day]) {
        grouped[day] = {
          day,
          totalSpending: 0,
          totalSavings: 0,
          closingBalance: 0,
          items: [],
        };
      }

      grouped[day].totalSpending += spending;
      grouped[day].totalSavings += savings;
      grouped[day].closingBalance = netSavings; // last row of the day wins

      grouped[day].items.push({
        place: row["Location"]?.trim(),
        neighbourhood: row["Neighbourhood"]?.trim(),
        action: row["Action"]?.trim(),
        original: spending > 0 ? row["Spending"]?.trim() : row["Savings"]?.trim(),
        amount: spending > 0 ? spending : savings,
        category,
        isSaving: category === "Saving",
      });
    });

    // Sort by day number
    const sorted = Object.values(grouped).sort((a, b) => {
      const numA = parseInt(a.day.replace("Day ", ""));
      const numB = parseInt(b.day.replace("Day ", ""));
      return numA - numB;
    });

    setDailyData(sorted);

    // Parse categories
    const categories = Papa.parse(categoriesCSV, {
      header: true,
      delimiter: ";",
      skipEmptyLines: true,
    });

    const catData = categories.data
      .filter((row) => row["Category"]?.trim() !== "Total general")
      .map((row) => ({
        name: row["Category"]?.trim(),
        value: parseFloat(row["Spending "]?.trim().replace(",", ".")) || 0,
      }));

    setCategoryData(catData);
  }, []);

  return { dailyData, categoryData };
}