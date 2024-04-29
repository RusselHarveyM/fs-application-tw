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

export function BarChartCustom({ data, scores }) {
  const [chartData, setChartData] = useState(scores);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // console.log("filteredRatings >> ", filteredRatings);

  useEffect(() => {
    if (data.length > 0) {
      console.log(data);

      const monthlyAverages = {};

      // Calculate monthly averages for the selected year
      data.forEach((space) => {
        // space.ratings.forEach((rating) => {
        const rating = space.rating[0];
        if (rating) {
          console.log(rating);
          const date = new Date(rating.dateModified);
          if (date.getFullYear() === selectedYear) {
            const month = `${date.toLocaleDateString("en-US", {
              month: "short",
            })} ${date.getFullYear()}`;
            if (!monthlyAverages[month]) {
              monthlyAverages[month] = {
                date: month,
                Sort: 0,
                "Set In Order": 0,
                Shine: 0,
                count: 0,
              };
            }
            monthlyAverages[month].Sort += rating.sort;
            monthlyAverages[month]["Set In Order"] += rating.setInOrder;
            monthlyAverages[month].Shine += rating.shine;
            monthlyAverages[month].count++;
          }
        }
        // });
      });

      // Calculate average scores
      const averageScores = Object.values(monthlyAverages).map((average) => ({
        date: average.date,
        Sort: (average.Sort / average.count).toFixed(1),
        "Set In Order": (average["Set In Order"] / average.count).toFixed(1),
        Shine: (average.Shine / average.count).toFixed(1),
      }));

      // Sort the data by date
      averageScores.sort((a, b) => new Date(a.date) - new Date(b.date));

      setChartData(averageScores);
    }
  }, [data, selectedYear]);

  // Extract available years from filteredRatings
  const availableYears = [
    ...new Set(
      data.flatMap((space) =>
        space.rating.map((rating) =>
          new Date(rating.dateModified).getFullYear()
        )
      )
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
