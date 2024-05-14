import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Overview from "../components/Overview";
import SpacesTable from "../components/SpacesTable";
import RedTag from "../components/RegTag";
import NoSpace from "../components/NoSpace";

import { DataContext } from "@/data/data-context";
import { isAdminLoggedIn } from "@/helper/auth";
import { Circle } from "rc-progress";

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
          <div className="absolute bottom-14 z-50 right-14">
            <Circle
              percent={50}
              trailWidth={18}
              strokeWidth={18}
              strokeLinecap="butt"
              trailColor={"#fff"}
              strokeColor={"#000"}
              className="animate-spin absolute w-7 h-7 left-1 top-1"
            />
          </div>
        )}
        {display}
      </div>
    </div>
  );
}
