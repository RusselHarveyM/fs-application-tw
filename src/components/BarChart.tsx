// NOTE: The tailwind.config.js has to be extended if you use custom HEX color
// ...['[#f0652f]'].flatMap((customColor) => [
//   `bg-${customColor}`,
//   `border-${customColor}`,
//   `hover:bg-${customColor}`,
//   `hover:border-${customColor}`,
//   `hover:text-${customColor}`,
//   `fill-${customColor}`,
//   `ring-${customColor}`,
//   `stroke-${customColor}`,
//   `text-${customColor}`,
//   `ui-selected:bg-${customColor}]`,
//   `ui-selected:border-${customColor}]`,
//   `ui-selected:text-${customColor}`,
// ]),

import { BarChart } from "@tremor/react";
import { useEffect, useState } from "react";

const chartdata = [
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

export function BarChartCustom({ filteredRatings }) {
  const [chartData, setChartDate] = useState([]);

  useEffect(() => {
    if (filteredRatings.length > 0) {
      // const latestRatings = [];
      // filteredRatings.forEach((space) => {
      //   const sortedRatings = space.ratings.sort(
      //     (a, b) => new Date(b.dateModified) - new Date(a.dateModified)
      //   );
      //   const latestRating = sortedRatings[0];
      //   const dateModified = new Date(
      //     latestRating.dateModified
      //   ).toLocaleDateString("en-US", {
      //     month: "long",
      //     day: "numeric",
      //   });
      //   latestRating.dateModified = dateModified;
      //   const newData = {
      //     date: dateModified,
      //     Sort: latestRating.sort,
      //     "Set In Order": latestRating.setInOrder,
      //     Shine: latestRating.shine,
      //   };
      //   latestRatings.push(newData);
      // });
      // setChartDate(() => latestRatings);
      // console.log(latestRatings);
    }
  }, [filteredRatings]);

  return (
    <>
      <BarChart
        className="rounded-2xl shadow w-2/3 bg-white p-8 h-full"
        data={chartdata}
        index="date"
        categories={["Sort", "Set In Order", "Shine"]}
        colors={["red-800", "red-700", "red-600"]}
        yAxisWidth={20}
        maxValue={10}
      />
    </>
  );
}
