import { useContext } from "react";
import { DataContext } from "../data/data-context"; // Import DataContext
import { DataTable } from "./data-table copy";
import { userColumns } from "./columns/UserColumns";
import { buildingColumns } from "./columns/BuildingColumns";
import { roomColumns } from "./columns/RoomColumns";
import { spaceColumns } from "./columns/SpaceColumns";

export default function Page({ tableContent }) {
  // Access the data context
  const { users, buildings, rooms, spaces } = useContext(DataContext);
  
  let data;
  let column;

  if (tableContent === "users") {
    data = users;
    column = userColumns;
  } else if (tableContent === "buildings") {
    data = buildings;
    column = buildingColumns;
  } else if (tableContent === "rooms") {
    data = rooms;
    column = roomColumns;
  } else if (tableContent === "spaces") {
    data = spaces;
    column = spaceColumns;
  }

  // Render the table with user data
  return (
    <div className="container mx-auto py-10">
      {data && <DataTable columns={column} data={data} tableContent={tableContent}/>}
    </div>
  );
}