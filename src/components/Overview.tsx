import { DataContext } from "@/data/data-context";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "./Card";
import { BarChartCustom } from "./BarChart";
import UserItem from "./UserItem";

export default function Overview() {
  const { users, rooms, spaces, ratings, useEntry } = useContext(DataContext);
  const [scores, setScores] = useState({
    average: 0,
    sort: 0,
    set: 0,
    shine: 0,
  });
  const [filteredRatings, setFilteredRatings] = useState([]);
  const [recentUsers, setRecentUsers] = useState({
    totalLength: 0,
    users: [],
  });

  const params = useParams();

  useEffect(() => {
    let action = {
      type: "ratings",
      method: "get",
    };
    useEntry(action);
    action.type = "comments";
    useEntry(action);
    const id = params.id;
    const room = rooms?.find((obj) => obj.id === id);
    let usersList = [];
    console.log("room overview >> ", room);
    if (room?.modifiedBy?.length > 0) {
      for (const userId of room?.modifiedBy) {
        const foundUser = users.find((obj) => obj.id === userId);
        usersList.push(foundUser);
      }
      setRecentUsers(() => {
        return {
          totalLength: usersList.length,
          users: usersList.slice(0, 5),
        };
      });
    }
    console.log("usersList overview >> ", usersList);
  }, [params.id, rooms]);

  useEffect(() => {
    const id = params.id;
    if (spaces && ratings) {
      let spaceRatings = [];
      let avgScore = { sort: 0, set: 0, shine: 0 };
      const spacesByRoomId = [...spaces.filter((space) => space.roomId === id)];
      for (const space of spacesByRoomId) {
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
        const rating = latestRating[0];
        avgScore.sort += rating?.sort;
        avgScore.set += rating?.setInOrder;
        avgScore.shine += rating?.shine;
        spaceRatings.push(spaceRating);
      }
      console.log(spaceRatings);

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
  }, [params.id, ratings, spaces]);

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
        <div className="w-1/4 h-full bg-white shadow rounded-2xl p-8">
          <h2 className="text-lg text-neutral-700 font-semibold">
            Recent Users
          </h2>
          <p className="text-neutral-400 text-sm">
            {recentUsers.totalLength} users attended to this room this year.
          </p>
          {recentUsers.users.map((user, index) => {
            return (
              <UserItem
                key={index}
                name={`${user.firstName} ${user.lastName}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
