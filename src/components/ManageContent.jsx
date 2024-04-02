import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import Button from "./Button";

export default function ManageContent() {
  const [tableContent, setTableContent] = useState("users");

  function onChangeTableContent(selected) {
    setTableContent(selected);
  }
  const highlightNavClass =
    "border-b-4 font-bold border-red-500 text-red-500 rounded-none";

  return (
    <div className="flex flex-col w-full m-auto py-6 px-8 mb-20">
      <div className="flex justify-between">
        <menu className="flex mb-8">
          <Button
            onClick={() => onChangeTableContent("users")}
            cssAdOns={tableContent === "users" ? highlightNavClass : undefined}
          >
            Users
          </Button>
          <Button
            onClick={() => onChangeTableContent("buildings")}
            cssAdOns={
              tableContent === "buildings" ? highlightNavClass : undefined
            }
          >
            Buildings
          </Button>
          <Button
            onClick={() => onChangeTableContent("rooms")}
            cssAdOns={tableContent === "rooms" ? highlightNavClass : undefined}
          >
            Rooms
          </Button>
          <Button
            onClick={() => onChangeTableContent("spaces")}
            cssAdOns={tableContent === "spaces" ? highlightNavClass : undefined}
          >
            Spaces
          </Button>
        </menu>
      </div>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Username</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Doe</TableCell>
            <TableCell>John</TableCell>
            <TableCell>johndoe123</TableCell>
            <TableCell className="text-right">Edit</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
