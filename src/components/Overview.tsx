import { DataContext } from "@/data/data-context";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "./Card";
import { BarChartCustom } from "./BarChart";

import { sortDate } from "@/helper/date.js";
import RecentUsers from "./RecentUsers";

export default function Overview({ ratings }) {
  const { users, rooms, spaces } = useContext(DataContext);
  const [scores, setScores] = useState();
  const [recentUsers, setRecentUsers] = useState({
    totalLength: 0,
    users: [],
  });
  const { id } = useParams();

  let data = [];
  const room = rooms.find((curr) => curr.id === id);
  const spacesByRoomId = spaces?.filter((curr) => curr.roomId === id);

  console.log("ratings >> ", ratings);
  if (spacesByRoomId) {
    for (const space of spacesByRoomId) {
      const foundRatings = ratings?.filter((curr) => curr.spaceId === space.id);
      const sortedRatings = sortDate(foundRatings);
      let newData = {
        ...space,
        ratings: sortedRatings,
      };
      data.push(newData);
    }
  }

  useEffect(() => {
    console.log("id >>", id);
    let usersList = [];
    if (room.modifiedBy?.length > 0) {
      for (
        let i = room.modifiedBy.length - 1;
        i >= 0 && usersList.length < 10;
        i--
      ) {
        const userId = room.modifiedBy[i];
        const foundUser = users.find((obj) => obj.id === userId);
        if (foundUser) {
          usersList.push(foundUser);
        }
      }

      setRecentUsers(() => {
        return {
          totalLength: room.modifiedBy?.length,
          users: usersList.slice(0, 5),
        };
      });
    }
  }, [room]);

  useEffect(() => {
    if (room && spaces) {
      const monthlyAverages = data.reduce((acc, space) => {
        space.ratings.forEach((rating) => {
          if (rating) {
            const date = new Date(rating.dateModified);
            const month = `${date.toLocaleDateString("en-US", {
              month: "short",
            })} ${date.getFullYear()}`;
            acc[month] = acc[month] || {
              date: month,
              Sort: 0,
              "Set In Order": 0,
              Shine: 0,
              count: 0,
            };
            acc[month].Sort += rating.sort;
            acc[month]["Set In Order"] += rating.setInOrder;
            acc[month].Shine += rating.shine;
            acc[month].count++;
          }
        });
        return acc;
      }, {});

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
          monthly: averageScores,
          average: currentMonth,
          sortDifference: sortDifference.toFixed(1),
          setDifference: setDifference.toFixed(1),
          shineDifference: shineDifference.toFixed(1),
          overallDifference: overallDifference.toFixed(1),
        }));
      } else {
        setScores(() => ({
          monthly: averageScores,
          average: averageScores[0],
        }));
      }
    }
  }, [room, spaces, ratings, id]);

  return (
    <div className="flex flex-col mt-4 bg-neutral-50 shadow-sm rounded-xl p-6 h-full md:w-[97rem] sm:w-[45rem] xs:w-[22rem] mx-auto gap-4">
      <div className="flex  xs:flex-row sm:flex-row md:flex-row lg:flex-row xl:flex-row w-full justify-around mt-4 mx-auto xs:-mb-8 sm:mb-0">
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
      <div className="flex md:flex-row sm:flex-col xs:flex-col gap-4 w-full h-[35rem] mt-4 -pt-8">
        <BarChartCustom scores={scores ?? { monthly: [] }} />
        <RecentUsers
          users={recentUsers}
          numberOfAttendees={recentUsers.totalLength}
        />
      </div>
    </div>
  );
}
