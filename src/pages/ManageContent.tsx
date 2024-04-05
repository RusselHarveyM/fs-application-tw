import { SetStateAction, useEffect, useState } from "react";
// import Loading from "react-loading";
import Button from "../components/Button";
import {
  getUsersData,
  getBuildingsData,
  getRoomsData,
  getSpacesData,
} from "@/data/Api";
import { DataTable } from "@/payments/data-table";
import { userColumns } from "@/payments/columns/UserColumns";
import { buildingColumns } from "@/payments/columns/BuildingColumns";
import { roomColumns } from "@/payments/columns/RoomColumns";
import { spaceColumns } from "@/payments/columns/SpaceColumns";

export default function ManageContent() {
  const [tableContent, setTableContent] = useState("users");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  function getColumns(tableContent: string) {
    switch (tableContent) {
      case "users":
        return userColumns;
      case "buildings":
        return buildingColumns;
      case "rooms":
        return roomColumns;
      case "spaces":
        return spaceColumns;
      default:
        throw new Error(`Invalid table content: ${tableContent}`);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let data;
        switch (tableContent) {
          case "users":
            data = await getUsersData();
            break;
          case "buildings":
            data = await getBuildingsData();
            break;
          case "rooms":
            data = await getRoomsData();
            break;
          case "spaces":
            data = await getSpacesData();
            break;
          default:
            throw new Error(`Invalid table content: ${tableContent}`);
        }
        setTableData(data);
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching ${tableContent} data:`, error);
        setLoading(false);
      }
    }
    fetchData();
  }, [tableContent]);

  function onChangeTableContent(selected: SetStateAction<string>) {
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
      <div className="container mx-auto py-10">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            {/* <Loading type={'spin'} color={'#000'} height={50} width={50} />  */}
            loading...
          </div>
        ) : (
          <DataTable
            columns={getColumns(tableContent)}
            data={tableData}
            tableContent={tableContent}
          />
        )}
      </div>
    </div>
  );
}
