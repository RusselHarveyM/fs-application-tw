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

const invoices = [
  {
    spaceName: "INV001",
    sort: "Paid",
    setInOrder: "$250.00",
    shine: "Credit Card",
    lastAssessed: "April 26",
    lastChecked: "April 26",

    status: "viewed",
  },
  {
    spaceName: "INV002",
    sort: "Pending",
    setInOrder: "$150.00",
    shine: "PayPal",
    lastAssessed: "April 26",
    lastChecked: "April 26",

    status: "viewed",
  },
  {
    spaceName: "INV003",
    sort: "Unpaid",
    setInOrder: "$350.00",
    shine: "Bank Transfer",
    lastAssessed: "April 26",
    lastChecked: "April 26",

    status: "viewed",
  },
  {
    spaceName: "INV004",
    sort: "Paid",
    setInOrder: "$450.00",
    shine: "Credit Card",
    lastAssessed: "April 26",
    lastChecked: "April 26",

    status: "viewed",
  },
  {
    spaceName: "INV005",
    sort: "Paid",
    setInOrder: "$550.00",
    shine: "PayPal",
    lastAssessed: "April 26",
    lastChecked: "April 26",

    status: "viewed",
  },
  {
    spaceName: "INV006",
    sort: "Pending",
    setInOrder: "$200.00",
    shine: "Bank Transfer",
    lastAssessed: "April 26",
    lastChecked: "April 26",

    status: "viewed",
  },
  {
    spaceName: "INV007",
    sort: "Unpaid",
    setInOrder: "$300.00",
    shine: "Credit Card",
    lastAssessed: "April 26",
    lastChecked: "April 26",
    status: "viewed",
  },
];

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
    <div className="w-[90rem] mx-auto bg-white rounded-lg mt-10 flex flex-col items-center justify-center p-6">
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

            return (
              <TableRow
                key={data.space.id}
                onClick={() => handleClickSpace(data)}
                className="hover:cursor-pointer"
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
                <TableCell className="text-right">
                  {data.space.viewedDate}
                </TableCell>
                <TableCell className="text-right">
                  {data.space.assessedDate}
                </TableCell>
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
