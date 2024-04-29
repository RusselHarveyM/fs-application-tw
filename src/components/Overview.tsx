import { DataContext } from "@/data/data-context";
import { useContext, useEffect, useState } from "react";
import Card from "./Card";
import { BarChartCustom } from "./BarChart";
import UserItem from "./UserItem";

export default function Overview({ data }) {
  const { users } = useContext(DataContext);
  const [scores, setScores] = useState();
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
  }, [data, users]);

  useEffect(() => {
    if (data) {
      const monthlyAverages = {};

      for (const space of data.spaces) {
        const rating = space.rating[0];
        if (rating) {
          const date = new Date(space.dateModified);
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

      const averageScores = Object.values(monthlyAverages).map((average) => {
        let sort = (average.Sort / average.count).toFixed(1);
        let set = (average["Set In Order"] / average.count).toFixed(1);
        let shine = (average.Shine / average.count).toFixed(1);
        return {
          date: average.date,
          Sort: sort,
          "Set In Order": set,
          Shine: shine,
          Average: (
            (parseFloat(sort) + parseFloat(set) + parseFloat(shine)) /
            3
          ).toFixed(1),
        };
      });

      averageScores.sort((a, b) => new Date(a.date) - new Date(b.date));
      console.log("average scores pppp", averageScores);

      if (averageScores.length > 1) {
        const currentMonth = averageScores[averageScores.length - 1];
        const previousMonth = averageScores[averageScores.length - 2];

        const sortDifference =
          ((currentMonth.Sort - previousMonth.Sort) / previousMonth.Sort) * 100;
        const setDifference =
          ((currentMonth["Set In Order"] - previousMonth["Set In Order"]) /
            previousMonth["Set In Order"]) *
          100;
        const shineDifference =
          ((currentMonth.Shine - previousMonth.Shine) / previousMonth.Shine) *
          100;

        const overallDifference =
          ((currentMonth.Average - previousMonth.Average) /
            previousMonth.Average) *
          100;

        setScores(() => ({
          average: currentMonth,
          sortDifference: sortDifference.toFixed(1),
          setDifference: setDifference.toFixed(1),
          shineDifference: shineDifference.toFixed(1),
          overallDifference: overallDifference.toFixed(1),
        }));
      } else {
        setScores(() => ({ average: averageScores[0] }));
      }
    }
  }, [data]);

  return (
    <div className="flex flex-col p-6 md:w-[97rem] sm:w-[45rem] mx-auto gap-4">
      <h2 className="md:text-2xl sm:text-3xl sm:text-center text-neutral-700 font-bold mt-2">
        Overview
      </h2>
      <div className="flex w-full justify-around mt-4 mx-auto">
        <Card
          score={scores?.average?.Average ?? 0}
          title={"Overall"}
          percent={`${scores?.overallDifference ?? 0}%`}
        />
        <Card
          score={scores?.average?.Sort ?? 0}
          title={"Sort"}
          percent={`${scores?.sortDifference ?? 0}%`}
        />
        <Card
          score={(scores?.average && scores?.average["Set In Order"]) ?? 0}
          title={"Set In Order"}
          percent={`${scores?.setDifference ?? 0}%`}
        />
        <Card
          score={scores?.average?.Shine ?? 0}
          title={"Shine"}
          percent={`${scores?.shineDifference ?? 0}%`}
        />
      </div>
      <div className="flex md:flex-row sm:flex-col gap-4 w-full h-[35rem] mt-8">
        <BarChartCustom data={data.spaces} scores={scores} />
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
