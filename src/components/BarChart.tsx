import { BarChart } from "@tremor/react";
import { useEffect, useState } from "react";

export function BarChartCustom({ scores }) {
  const { monthly } = scores;
  const [chartData, setChartData] = useState(monthly);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const availableYears = Array.from(
    new Set(monthly.map((rating) => new Date(rating.date).getFullYear()))
  ).sort((a, b) => b - a);

  console.log(scores);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  useEffect(() => {
    const filteredMonth = monthly?.filter(
      (curr) => new Date(curr.date).getFullYear() === parseInt(selectedYear)
    );
    setChartData(filteredMonth);
  }, [selectedYear, monthly]);

  return (
    <div className="relative md:w-3/4 sm:w-full">
      <div className="flex absolute top-4 left-8 justify-center items-center mb-4">
        <label htmlFor="year" className="mr-2 text-neutral-500">
          Select Year:
        </label>
        <select
          id="year"
          className="border border-gray-300 rounded text-neutral-500"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <BarChart
        className="rounded-2xl shadow w-full bg-white p-8 md:h-full sm:h-[30rem]"
        data={chartData}
        index="date"
        categories={["Sort", "Set In Order", "Shine"]}
        colors={["red-800", "red-700", "red-600"]}
        yAxisWidth={20}
        maxValue={10}
      />
    </div>
  );
}
