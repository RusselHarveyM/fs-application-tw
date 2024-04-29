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
import { useState, useContext } from "react";
import { DataContext } from "@/data/data-context";

export default function SpacesTable({ data }) {
  console.log(data);
  const [spaceData, setSpaceData] = useState(undefined);
  const { useEntry } = useContext(DataContext);

  function handleClickSpace(data) {
    if (data.space.id !== spaceData?.space.id) {
      let action = {
        type: "spaceimages",
        method: "get",
        data: {
          id: data.space.id,
        },
      };
      useEntry(action);
      console.log("data >> ", data);
      setSpaceData(() => data);
    }
  }

  return (
    <div className="md:w-[90rem] sm:w-[44rem] mx-auto bg-white rounded-lg mt-10 flex flex-col items-center justify-center p-6">
      <Table>
        <TableCaption>A list of your recent spaces.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Name</TableHead>
            {JSON.parse(localStorage.getItem("isLoggedIn")).role ===
              "admin" && (
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
          {data.map((data) => {
            let statusCss = "w-fit rounded-xl py-2 px-4";
            let statusCaption = "not viewed";
            if (data.space.viewedDate) {
              statusCaption = "viewed";
              statusCss += " bg-purple-500 text-white  ";
            } else {
              statusCss += " bg-neutral-300 text-white  ";
            }

            const viewedDate = data?.space?.viewedDate
              ? new Date(data?.space?.viewedDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })
              : "----";

            const assessedDate = data?.space?.assessedDate
              ? new Date(data?.space?.assessedDate).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  }
                )
              : "----";
            return (
              <TableRow
                key={data.space.id}
                onClick={() => handleClickSpace(data)}
                className={`hover:cursor-pointer ${
                  data.space.id === spaceData?.space?.id && "bg-neutral-50"
                }`}
              >
                <TableCell className="font-medium">{data.space.name}</TableCell>
                {JSON.parse(localStorage.getItem("isLoggedIn")).role ===
                  "admin" && (
                  <>
                    <TableCell className="text-center">
                      {data.rating[0] ? data.rating[0]?.sort : 0}
                    </TableCell>
                    <TableCell className="text-center ">
                      {data.rating[0] ? data.rating[0]?.setInOrder : 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {data.rating[0] ? data.rating[0]?.shine : 0}
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
      {spaceData && <Space data={spaceData} />}
    </div>
  );
}
