import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Overview from "../components/Overview";
import Space from "../components/Space";
import RedTag from "../components/RegTag";
import NoSpace from "../components/NoSpace";

import { DataContext } from "@/data/data-context";

export default function Spaces() {
  const { rooms, spaces, buildings } = useContext(DataContext);
  const param = useParams();
  const [content, setContent] = useState({
    selectedTab: "overview",
    selectedSpaceId: undefined,
    data: {
      room: [],
      spaces: [],
    },
  });

  useEffect(() => {
    setContent((prev) => {
      const roomsCopy = [...rooms];
      const room = roomsCopy.find((r) => r.id === param.id);
      const spacesCopy = spaces?.filter((space) => space.roomId === param.id);
      return {
        ...prev,
        selectedSpaceId: spacesCopy[0],
        data: {
          room,
          spaces: spacesCopy,
        },
      };
    });
  }, [param.id]);

  function handleSelectTab(selected) {
    setContent((prev) => {
      return {
        ...prev,
        selectedTab: selected,
      };
    });
  }

  let display = <Overview />;
  if (content.selectedTab === "spaces") {
    if (content.selectedSpaceId === undefined) {
      display = <NoSpace />;
    } else {
      display = <Space />;
    }
  } else if (content.selectedTab === "redtags") {
    display = <RedTag />;
  }

  return (
    <div className="flex w-screen h-screen bg-neutral-100">
      <Sidebar
        roomData={content.data?.room}
        buildingData={
          buildings
            ? buildings.find(
                (building) => building.id === content.data.room?.buildingId
              )
            : []
        }
        onSelectTab={handleSelectTab}
        selectedTab={content.selectedTab}
      />
      <div className="w-full overflow-y-auto h-screen">{display}</div>
    </div>
  );
}
