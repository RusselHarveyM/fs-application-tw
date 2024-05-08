import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Space from "./Space";
import { useState } from "react";

import { checkMonth, getDateString, sortDate } from "@/helper/date";
import { isAdminLoggedIn } from "@/helper/auth";

export default function SpacesTable({ data, ratings }) {
  console.log(data);
  const spaceId = data[0].id;
  const [selectedId, setSelectedId] = useState(spaceId);

  function handleClickSpace(clickedData) {
    if (clickedData.id !== selectedId) {
      setSelectedId(clickedData.id);
    }
  }
  const foundSpace = data.find((curr) => curr.id === selectedId);

  const isLoggedIn = isAdminLoggedIn();

  const foundRatings = ratings?.filter((curr) => curr.spaceId === selectedId);

  return (
    <div className="md:w-[90rem] sm:w-[44rem] mx-auto bg-white rounded-lg mt-10 flex flex-col items-center justify-center p-6">
      <Table>
        <TableCaption>A list of your recent spaces.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Name</TableHead>
            {isLoggedIn && (
              <>
                <TableHead className="text-center">Sort</TableHead>
                <TableHead className="text-center">Set In Order</TableHead>
                <TableHead className="text-center">Shine</TableHead>
              </>
            )}
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Last Checked</TableHead>
            <TableHead className="text-right">Last Assessed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((currData) => {
            let statusCss = "w-fit rounded-xl py-2 px-4";
            let statusCaption = "not viewed";
            if (
              checkMonth(currData.viewedDate) &&
              checkMonth(currData.assessedDate)
            ) {
              statusCaption = "viewed";
              statusCss += " bg-purple-500 text-white  ";
            } else {
              statusCss += " bg-neutral-300 text-white  ";
            }

            const currRatings = sortDate(ratings);
            // console.log(ratings);
            const viewedDate =
              currData?.viewedDate && currData?.assessedDate
                ? getDateString(currData?.viewedDate)
                : "----";

            const assessedDate = currData?.assessedDate
              ? getDateString(currData?.assessedDate)
              : "----";
            return (
              <TableRow
                key={currData.id}
                onClick={() => handleClickSpace(currData)}
                className={`hover:cursor-pointer ${
                  currData.id === selectedId && "bg-neutral-50"
                }`}
              >
                <TableCell className="font-medium">{currData?.name}</TableCell>
                {isLoggedIn && (
                  <>
                    <TableCell className="text-center">
                      {currRatings && currRatings.length > 0
                        ? currRatings[0]?.sort
                        : 0}
                    </TableCell>
                    <TableCell className="text-center ">
                      {currRatings && currRatings.length > 0
                        ? currRatings[0]?.setInOrder
                        : 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {currRatings && currRatings.length > 0
                        ? currRatings[0]?.shine
                        : 0}
                    </TableCell>
                  </>
                )}

                <TableCell className="text-center flex items-center justify-center">
                  <p className={`${statusCss}`}>{statusCaption}</p>
                </TableCell>
                <TableCell className="text-right">{viewedDate}</TableCell>
                <TableCell className="text-right">{assessedDate}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
      <Space data={foundSpace} spaceId={selectedId} ratings={foundRatings} />
    </div>
  );
}
