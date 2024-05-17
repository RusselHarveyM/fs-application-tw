import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Overview from "../components/Overview";
import SpacesTable from "../components/SpacesTable";
import NoSpace from "../components/NoSpace";
import { DataContext } from "@/data/data-context";
import { isAdminLoggedIn } from "@/helper/auth";
import { sortDate } from "@/helper/date.js";
import { Circle } from "rc-progress";

export default function Spaces() {
  const { rooms, spaces, buildings, ratings, useEntry } =
    useContext(DataContext);
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState(
    isAdminLoggedIn() ? "overview" : "spaces"
  );
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    setIsLoad(false);
  }, [ratings]);

  useEffect(() => {
    const action = { type: "ratings", method: "get" };
    setIsLoad(true);
    useEntry(action);
  }, [useEntry]);

  const room = rooms?.find((r) => r.id === id);
  const spacesByRoomId = spaces?.filter((space) => space.roomId === id) || [];
  const building = buildings?.find(
    (building) => building.id === room?.buildingId
  );

  const data = spacesByRoomId.map((space) => ({
    ...space,
    ratings: sortDate(
      ratings?.filter((rating) => rating.spaceId === space.id) || []
    ),
  }));

  const dataByRoom = { data, room };

  const renderContent = () => {
    if (selectedTab === "spaces") {
      return spacesByRoomId.length === 0 ? (
        <NoSpace />
      ) : (
        <SpacesTable
          data={spacesByRoomId}
          ratings={ratings || []}
          dataByRoom={dataByRoom}
        />
      );
    }
    if (selectedTab === "redtags") {
      return <RedTag />;
    }
    return <Overview ratings={ratings || []} dataByRoom={dataByRoom} />;
  };

  return (
    <div className="flex w-screen h-screen bg-neutral-100">
      <Sidebar
        roomData={room}
        buildingData={building}
        onSelectTab={setSelectedTab}
        selectedTab={selectedTab}
      />
      <div className="w-full overflow-y-auto h-screen relative">
        {isLoad && (
          <div className="absolute bottom-14 right-14 z-50">
            <Circle
              percent={50}
              trailWidth={18}
              strokeWidth={18}
              strokeLinecap="butt"
              trailColor="#fff"
              strokeColor="#000"
              className="animate-spin w-7 h-7"
            />
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
}
