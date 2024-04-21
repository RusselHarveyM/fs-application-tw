import { DataContext } from "@/data/data-context";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "./Card";
import { BarChartCustom } from "./BarChart";

export default function Overview() {
  const { spaces, ratings } = useContext(DataContext);
  const [scores, setScores] = useState({
    average: 0,
    sort: 0,
    set: 0,
    shine: 0,
  });
  const [filteredRatings, setFilteredRatings] = useState([]);

  const params = useParams();

  useEffect(() => {
    const id = params.id;
    if (spaces) {
      let spaceRatings = [];
      const spacesByRoomId = [...spaces.filter((space) => space.roomId === id)];
      spacesByRoomId.forEach((space) => {
        let ratingsBySpaceId = [
          ...ratings.filter((rating) => rating.spaceId === space.id),
        ];
        const latestRating = ratingsBySpaceId.sort(
          (a, b) =>
            new Date(b.dateModified).getTime() -
            new Date(a.dateModified).getTime()
        );
        const spaceRating = {
          space,
          ratings: latestRating,
        };
        spaceRatings.push(spaceRating);
      });
      let avgScore = { sort: 0, set: 0, shine: 0 };
      spaceRatings.map((spaceRating) => {
        const ratings = spaceRating.ratings[0];
        avgScore.sort += ratings?.sort;
        avgScore.set += ratings?.setInOrder;
        avgScore.shine += ratings?.shine;
      });
      const total = avgScore.sort + avgScore.set + avgScore.shine;
      if (total > 0) {
        setScores(() => {
          const totalScores = total;
          const average = totalScores / spacesByRoomId.length;
          const percScore = average / 30;
          const score = percScore * 10;
          const finalScore = Math.min(Math.max(score, 1), 10);

          const sort = avgScore.sort / spacesByRoomId.length;
          const set = avgScore.set / spacesByRoomId.length;
          const shine = avgScore.shine / spacesByRoomId.length;

          return {
            average: finalScore.toFixed(1),
            sort: sort.toFixed(1),
            set: set.toFixed(1),
            shine: shine.toFixed(1),
          };
        });
        setFilteredRatings(() => spaceRatings);
      }
    }
  }, [params.id]);

  return (
    <div className="flex flex-col p-6 w-[97rem] mx-auto gap-4">
      <h2 className="text-2xl text-neutral-700 font-bold mt-2">Overview</h2>
      <div className="flex w-full justify-around mt-4 mx-auto">
        <Card score={scores?.average ?? 0} title={"Overall"} percent="8%" />
        <Card score={scores?.sort ?? 0} title={"Sort"} />
        <Card score={scores?.set ?? 0} title={"Set In Order"} percent="14%" />
        <Card score={scores?.shine ?? 0} title={"Shine"} />
      </div>
      <div className="flex gap-4 w-full h-[35rem] mt-8">
        <BarChartCustom filteredRatings={filteredRatings} />
        <div className="w-1/3 h-full bg-white shadow rounded-2xl p-8">
          <h2 className="text-lg text-neutral-700 font-semibold">
            Recent Users
          </h2>
          <p className="text-neutral-400 text-sm">
            0 users attended to this room this year.
          </p>
        </div>
      </div>
    </div>
  );
}
