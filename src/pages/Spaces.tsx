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
  const [content, setContent] = useState({
    selectedTab: isAdminLoggedIn() ? "overview" : "spaces",
    selectedSpaceId: undefined,
    data: {
      room: [],
      spaces: [],
    },
  });
  useEffect(() => {
    let action = {
      type: "ratings",
      method: "get",
    };
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
    setContent((prev) => {
      return {
        ...prev,
        selectedTab: selected,
      };
    });
  }

  let display;
  if (content.selectedTab === "spaces") {
    if (spacesByRoomId.length === 0) {
      display = <NoSpace />;
    } else {
      display = <SpacesTable data={spacesByRoomId} ratings={ratings ?? []} />;
    }
  } else if (content.selectedTab === "redtags") {
    display = <RedTag />;
  } else {
    display = <Overview data={content.data} ratings={ratings ?? []} />;
  }

  return (
    <div className="flex w-screen h-screen bg-neutral-100">
      <Sidebar
        roomData={room}
        buildingData={buildingsData}
        // isLoad={isLoading}
        onSelectTab={handleSelectTab}
        selectedTab={content.selectedTab}
      />
      <div className="w-full overflow-y-auto h-screen">{display}</div>
    </div>
  );
}
