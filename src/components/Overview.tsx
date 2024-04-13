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
    console.log(spacesByRoomId);
    console.log(ratings);
    spacesByRoomId.forEach((space) => {
      let ratingsBySpaceId = [
        ...ratings.filter((rating) => rating.spaceId === space.id),
      ];
      console.log(space);
      console.log(ratingsBySpaceId);

      const spaceRating = {
        space,
        ratings: ratingsBySpaceId,
      };
      spaceRatings.push(spaceRating);
    });
    let avgScore = { sort: 0, set: 0, shine: 0 };
    spaceRatings.map((spaceRating) => {
      const ratings = spaceRating.ratings;
      const latestRating = ratings.sort(
        (a, b) =>
          new Date(b.dateModified).getTime() -
          new Date(a.dateModified).getTime()
      )[0];
      console.log(latestRating);
      avgScore.sort += latestRating.sort;
      avgScore.set += latestRating.setInOrder;
      avgScore.shine += latestRating.shine;
    });

    setAverageScore(() => {
      return (
        (avgScore.sort + avgScore.set + avgScore.shine) / spacesByRoomId.length
      );
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
