import { DataContext } from "@/data/data-context";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "./Card";
import { BarChartCustom } from "./BarChart";

import RecentUsers from "./RecentUsers";

import {
  calculateMonthlyAverages,
  checkYear,
  checkMonth,
} from "@/helper/date.js";

export default function Overview({ ratings, dataByRoom }) {
  const { users, rooms, spaces } = useContext(DataContext);
  const [scores, setScores] = useState();
  const [recentUsers, setRecentUsers] = useState({
    totalLength: 0,
    users: [],
  });
  const { id } = useParams();

  const data = dataByRoom.data;
  console.log("[][data]", data);
  const room = dataByRoom.room;
  console.log("[][room]", room);

  useEffect(() => {
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
      const averageScores = calculateMonthlyAverages(data);
      console.log("averageScores >> ", averageScores);
      if (averageScores.length > 1) {
        const currentMonth = averageScores[0];
        const previousMonth = averageScores[1];

        const calculateDifference = (current, previous) => {
          if (previous == 0) {
            if (current == 0) {
              return 0;
            } else {
              return current * 10;
            }
          }
          return ((current - previous) / previous) * 10;
        };

        setScores({
          monthly: averageScores,
          average: currentMonth,
          sortDifference: calculateDifference(
            currentMonth.Sort,
            previousMonth.Sort
          ).toFixed(1),
          setDifference: calculateDifference(
            currentMonth["Set In Order"],
            previousMonth["Set In Order"]
          ).toFixed(1),
          shineDifference: calculateDifference(
            currentMonth.Shine,
            previousMonth.Shine
          ).toFixed(1),
          overallDifference: calculateDifference(
            currentMonth.Average,
            previousMonth.Average
          ).toFixed(1),
        });
      } else if (averageScores.length === 1) {
        setScores({
          monthly: averageScores,
          average: averageScores[0],
        });
      }
    }
  }, [room, spaces, data, ratings, id]);

  const avgDate = scores?.average?.originalDate;

  console.log("avgDate >> ", checkMonth(avgDate));

  return (
    <div className="flex flex-col mt-4 bg-neutral-50 shadow-sm rounded-xl p-6 h-full md:w-[97rem] sm:w-[45rem] xs:w-[22rem] mx-auto gap-4">
      <div className="flex  xs:flex-row sm:flex-row md:flex-row lg:flex-row xl:flex-row w-full justify-around mt-4 mx-auto xs:-mb-8 sm:mb-0">
        <Card
          score={
            checkMonth(avgDate) && checkYear(avgDate)
              ? scores?.average?.Average ?? 0
              : 0
          }
          title={"Overall"}
          percent={`${
            checkMonth(avgDate) && checkYear(avgDate)
              ? scores?.overallDifference ?? 0
              : 0
          }%`}
        />
        <Card
          score={
            checkMonth(avgDate) && checkYear(avgDate)
              ? scores?.average?.Sort ?? 0
              : 0
          }
          title={"Sort"}
          percent={`${
            checkMonth(avgDate) && checkYear(avgDate)
              ? scores?.sortDifference ?? 0
              : 0
          }%`}
        />
        <Card
          score={
            checkMonth(avgDate) && checkYear(avgDate)
              ? (scores?.average && scores?.average["Set In Order"]) ?? 0
              : 0
          }
          title={"Set In Order"}
          percent={`${
            checkMonth(avgDate) && checkYear(avgDate)
              ? scores?.setDifference ?? 0
              : 0
          }%`}
        />
        <Card
          score={
            checkMonth(avgDate) && checkYear(avgDate)
              ? scores?.average?.Shine ?? 0
              : 0
          }
          title={"Shine"}
          percent={`${
            checkMonth(avgDate) && checkYear(avgDate)
              ? scores?.shineDifference ?? 0
              : 0
          }%`}
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
