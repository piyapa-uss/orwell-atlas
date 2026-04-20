import { useState, useEffect } from "react";
import Papa from "papaparse";

import dailyCSV from "../../data/daily_spending.csv?raw";
import categoriesCSV from "../../data/spending_categories.csv?raw";

export function useSpendingData() {
  const [dailyData, setDailyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    // Parse daily spending
    const daily = Papa.parse(dailyCSV, {
      header: true,
      delimiter: ";",
      skipEmptyLines: true,
    });

    // Clean and group by day
    const grouped = {};
    daily.data.forEach((row) => {
      const day = row["Day"]?.trim();
      const rawAmount = row["Spending (Decimal Pounds System)"]
        ?.trim()
        .replace(",", ".");
      const amount = parseFloat(rawAmount) || 0;

      if (!grouped[day]) grouped[day] = { day, total: 0, items: [] };

      grouped[day].total += amount;
      grouped[day].items.push({
        place: row["Place"]?.trim(),
        neighbourhood: row["Neighbourhood"]?.trim(),
        action: row["Action"]?.trim(),
        original: row["Spending"]?.trim(),
        amount,
        category: row["Category"]?.trim(),
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
        value: parseFloat(
          row["Spending "]?.trim().replace(",", ".")
        ) || 0,
      }));

    setCategoryData(catData);
  }, []);

  return { dailyData, categoryData };
}