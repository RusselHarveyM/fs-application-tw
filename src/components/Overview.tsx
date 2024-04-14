import CircularProgress from "./CircularProgress";
import { DataContext } from "@/data/data-context";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "./Card";
import { BarChartCustom } from "./BarChart";

export default function Overview() {
  const { spaces, ratings } = useContext(DataContext);
  const [scores, setScores] = useState({
    averate: 0,
    sort: 0,
    set: 0,
    shine: 0,
  });

  const params = useParams();

  useEffect(() => {
    const id = params.id;
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
      console.log(space);
      console.log(latestRating);

      const spaceRating = {
        space,
        ratings: latestRating,
      };
      spaceRatings.push(spaceRating);
    });
    let avgScore = { sort: 0, set: 0, shine: 0 };
    spaceRatings.map((spaceRating) => {
      const ratings = spaceRating.ratings[0];
      console.log(ratings);
      avgScore.sort += ratings.sort;
      avgScore.set += ratings.setInOrder;
      avgScore.shine += ratings.shine;
    });

    setScores(() => {
      const totalScores = avgScore.sort + avgScore.set + avgScore.shine;
      console.log(totalScores);
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

    console.log(spaceRatings);
  }, [params.id]);

  {
  }

  return (
    <div className="flex flex-col p-6 w-[97rem] mx-auto gap-4">
      <h2 className="text-2xl text-neutral-800 font-bold mt-2">Overview</h2>
      <div className="flex w-full justify-around mt-4 mx-auto">
        <Card score={scores.average} title={"Overall"} />
        <Card score={scores.sort} title={"Sort"} />
        <Card score={scores.set} title={"Set In Order"} />
        <Card score={scores.shine} title={"Shine"} />
      </div>
      <div className="flex gap-4 w-full h-[35rem] mt-8">
        <BarChartCustom />
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
