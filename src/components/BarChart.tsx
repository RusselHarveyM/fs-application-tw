import { BarChart } from "@tremor/react";
import { useEffect, useState } from "react";

const DUMMY_DATA = [
  {
    date: "Jan 23",
    Sort: 6,
    "Set In Order": 6.5,
    Shine: 8,
  },
  {
    date: "Feb 23",
    Sort: 8,
    "Set In Order": 8,
    Shine: 6,
  },
  {
    date: "Mar 23",
    Sort: 8,
    "Set In Order": 10,
    Shine: 10,
  },
  {
    date: "Apr 23",
    Sort: 8,
    "Set In Order": 7,
    Shine: 8,
  },
  {
    date: "May 23",
    Sort: 10,
    "Set In Order": 7,
    Shine: 3,
  },
  {
    date: "Jun 23",
    Sort: 7,
    "Set In Order": 7,
    Shine: 8,
  },
  {
    date: "Jul 23",
    Sort: 8,
    "Set In Order": 9,
    Shine: 8,
  },
];

export function BarChartCustom({ scores }) {
  const [chartData, setChartData] = useState(scores);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { monthly } = scores;

  console.log("scores >> ", scores);
  console.log("monthly >> ", monthly);

  useEffect(() => {
    setChartData(monthly);
  }, [selectedYear]);

  // Extract available years from filteredRatings
  const availableYears = [
    ...new Set(
      monthly.flatMap((rating) => new Date(rating.date).getFullYear())
    ),
  ].sort((a, b) => b - a);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

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
        // data={DUMMY_DATA}
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
