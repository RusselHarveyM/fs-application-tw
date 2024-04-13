import CircularProgress from "./CircularProgress";
import { DataContext } from "@/data/data-context";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Overview() {
  const { spaces, ratings } = useContext(DataContext);
  const [averageScore, setAverageScore] = useState(0);

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

    setAverageScore(() => {
      const totalScores = avgScore.sort + avgScore.set + avgScore.shine;
      console.log(totalScores);
      const average = totalScores / spacesByRoomId.length;
      const percScore = average / 30;
      const score = percScore * 100;
      const finalScore = Math.min(Math.max(score, 1), 100);
      return finalScore.toFixed(1);
    });

    console.log(spaceRatings);
  }, [params.id]);

  return (
    <div className="flex flex-col p-6 w-[82rem] mx-auto">
      <div className="flex flex-col bg-white w-full gap-8 shadow-sm py-8 px-16 rounded-lg">
        <h2 className="text-2xl text-neutral-500 font-bold">Overview</h2>
        <div className="flex">
          <CircularProgress
            percent={averageScore}
            strokeColor="#1dd75b"
            trailColor="#b8f5cd"
          />
        </div>
      </div>
    </div>
  );
}
