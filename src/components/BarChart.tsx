import { BarChart } from "@tremor/react";
import { useMemo, useState } from "react";

function parseDate(dateStr) {
  const [monthStr, yearStr] = dateStr.split(" ");
  const month = new Date(Date.parse(`${monthStr} 1, 2000`)).getMonth();
  const year = parseInt(yearStr);
  return { month, year };
}

export function BarChartCustom({ scores }) {
  const { monthly } = scores;
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const availableYears = useMemo(() => {
    return Array.from(
      new Set(monthly.map(({ date }) => parseDate(date).year))
    ).sort((a, b) => b - a);
  }, [monthly]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const chartData = useMemo(() => {
    return monthly
      .filter(({ date }) => {
        const parsedDate = parseDate(date);
        return (
          parsedDate.year < currentYear ||
          (parsedDate.year === currentYear && parsedDate.month < currentMonth)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(parseDate(a.date).year, parseDate(a.date).month);
        const dateB = new Date(parseDate(b.date).year, parseDate(b.date).month);
        return dateA - dateB;
      });
  }, [monthly, selectedYear, currentYear, currentMonth]);

  return (
    <div className="relative md:w-3/4 sm:w-full xs:w-full mt-0 -pt-4">
      <div className="flex absolute top-4 left-8 justify-center items-center mb-4">
        <label htmlFor="year" className="mr-2 text-neutral-500">
          Select Year:
        </label>
        <select
          id="year"
          className="border border-gray-300 rounded text-neutral-500"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <BarChart
        className="rounded-2xl shadow w-full bg-white p-8 md:h-full sm:h-[30rem] xs:h-[20rem] xs:mt-1 xs:pt-12"
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
