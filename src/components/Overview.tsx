import { DataContext } from "@/data/data-context";
import { useContext, useEffect, useState } from "react";
import Card from "./Card";
import { BarChartCustom } from "./BarChart";
import UserItem from "./UserItem";

export default function Overview({ data }) {
  const { users } = useContext(DataContext);
  const [scores, setScores] = useState({
    average: 0,
    sort: 0,
    set: 0,
    shine: 0,
    count: 0,
  });
  const [recentUsers, setRecentUsers] = useState({
    totalLength: 0,
    users: [],
  });

  useEffect(() => {
    let usersList = [];
    console.log("data overview >> ", data);
    if (data?.room.modifiedBy?.length > 0) {
      for (const userId of data?.room.modifiedBy) {
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
  }, [data]);

  useEffect(() => {
    if (data) {
      let avgScore = { sort: 0, set: 0, shine: 0, count: 0 };

      for (const space of data.spaces) {
        const rating = space.rating[0];
        console.log(space);
        if (rating) {
          avgScore.sort += rating?.sort;
          avgScore.set += rating?.setInOrder;
          avgScore.shine += rating?.shine;
          avgScore.count++;
        }
      }

      const total = avgScore.sort + avgScore.set + avgScore.shine;
      if (total > 0) {
        setScores(() => {
          const totalScores = total;
          const average = totalScores / avgScore.count;
          const percScore = average / 30;
          const score = percScore * 10;
          const finalScore = Math.min(Math.max(score, 1), 10);

          const sort = avgScore.sort / avgScore.count;
          const set = avgScore.set / avgScore.count;
          const shine = avgScore.shine / avgScore.count;

          return {
            average: finalScore.toFixed(1),
            sort: sort.toFixed(1),
            set: set.toFixed(1),
            shine: shine.toFixed(1),
          };
        });
      }
    }
  }, [data]);

  return (
    <div className="flex flex-col p-6 md:w-[97rem] sm:w-[45rem] mx-auto gap-4">
      <h2 className="md:text-2xl sm:text-3xl sm:text-center text-neutral-700 font-bold mt-2">
        Overview
      </h2>
      <div className="flex w-full justify-around mt-4 mx-auto">
        <Card score={scores?.average ?? 0} title={"Overall"} percent="8%" />
        <Card score={scores?.sort ?? 0} title={"Sort"} />
        <Card score={scores?.set ?? 0} title={"Set In Order"} percent="14%" />
        <Card score={scores?.shine ?? 0} title={"Shine"} />
      </div>
      <div className="flex md:flex-row sm:flex-col gap-4 w-full h-[35rem] mt-8">
        <BarChartCustom filteredRatings={data.spaces} />
        <div className="md:w-1/4 sm:full h-full bg-white shadow rounded-2xl p-8">
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
                name={`${user?.firstName} ${user?.lastName}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
