import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Overview from "../components/Overview";
import SpacesTable from "../components/SpacesTable";
import RedTag from "../components/RegTag";
import NoSpace from "../components/NoSpace";

import { DataContext } from "@/data/data-context";
import { isAdminLoggedIn } from "@/helper/auth";

export default function Spaces() {
  const { rooms, spaces, buildings, ratings, useEntry } =
    useContext(DataContext);
  const param = useParams();
  const [selectedTab, setSelectedTab] = useState(
    isAdminLoggedIn() ? "overview" : "spaces"
  );
  const [isLoad, setIsLoad] = useState();

  useEffect(() => {
    setIsLoad(false);
    param;
  }, [ratings]);

  useEffect(() => {
    let action = {
      type: "ratings",
      method: "get",
    };
    setIsLoad(true);
    useEntry(action);
  }, []);

  const room = rooms ? rooms.find((r) => r.id === param.id) : {};
  const spacesByRoomId = spaces
    ? [...spaces.filter((space) => space.roomId === param.id)]
    : [];
  const buildingsData = buildings
    ? buildings.find((building) => building.id === room?.buildingId)
    : [];
  console.log("test t", spacesByRoomId);

  function handleSelectTab(selected) {
    setSelectedTab(selected);
  }

  let display;
  if (selectedTab === "spaces") {
    if (spacesByRoomId.length === 0) {
      display = <NoSpace />;
    } else {
      display = <SpacesTable data={spacesByRoomId} ratings={ratings ?? []} />;
    }
  } else if (selectedTab === "redtags") {
    display = <RedTag />;
  } else {
    display = <Overview ratings={ratings ?? []} />;
  }

  return (
    <div className="flex w-screen h-screen bg-neutral-100">
      <Sidebar
        roomData={room}
        buildingData={buildingsData}
        // isLoad={isLoading}
        onSelectTab={handleSelectTab}
        selectedTab={selectedTab}
      />

      <div className="w-full overflow-y-auto h-screen">
        {isLoad && (
          <div className=" w-32 h-fit text-center m-auto pt-2 mt-16">
            <p className="text-neutral-600 animate-bounce">Loading data...</p>
          </div>
        )}
        {display}
      </div>
    </div>
  );
}
