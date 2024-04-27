import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Overview from "../components/Overview";
import SpacesTable from "../components/SpacesTable";
import RedTag from "../components/RegTag";
import NoSpace from "../components/NoSpace";

import { DataContext } from "@/data/data-context";

export default function Spaces() {
  const { rooms, spaces, spaceImages, ratings, buildings, useEntry } =
    useContext(DataContext);
  const param = useParams();
  const [content, setContent] = useState({
    selectedTab:
      JSON.parse(localStorage.getItem("isLoggedIn")).role === "admin"
        ? "overview"
        : "spaces",
    selectedSpaceId: undefined,
    data: {
      room: [],
      spaces: [],
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let action = {
      type: "ratings",
      method: "get",
    };
    useEntry(action);
    action.type = "comments";
    useEntry(action);
    action.type = "spaceimages";
    useEntry(action);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
    }
    if (rooms && ratings && spaceImages) {
      setContent((prev) => {
        console.log("rooms >>> ", rooms);
        const room = rooms.find((r) => r.id === param.id);
        console.log("room >>> ", room);
        const spacesByRoomId = [
          ...spaces.filter((space) => space.roomId === param.id),
        ];
        let spaceRatings = [];
        if (ratings) {
          for (const space of spacesByRoomId) {
            let ratingsBySpaceId = [
              ...ratings?.filter((rating) => rating.spaceId === space.id),
            ];
            let picturesFound = [
              ...spaceImages?.filter((spi) => spi.spaceId === space.id),
            ];
            const latestRating = ratingsBySpaceId.sort(
              (a, b) =>
                new Date(b.dateModified).getTime() -
                new Date(a.dateModified).getTime()
            );
            spaceRatings.push({
              space: { ...space, pictures: picturesFound },
              rating: latestRating,
            });
          }
        }
        setIsLoading(false);
        return {
          ...prev,
          selectedSpaceId: spacesByRoomId[0],
          data: {
            room,
            spaces: spaceRatings,
          },
        };
      });
    }
  }, [spaces, ratings, rooms, spaceImages]);

  function handleSelectTab(selected) {
    setContent((prev) => {
      return {
        ...prev,
        selectedTab: selected,
      };
    });
  }

  let display = <Overview data={content.data} />;
  if (content.selectedTab === "spaces") {
    if (content.selectedSpaceId === undefined) {
      display = <NoSpace />;
    } else {
      display = <SpacesTable data={content.data.spaces} />;
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
        isLoad={isLoading}
        onSelectTab={handleSelectTab}
        selectedTab={content.selectedTab}
      />
      <div className="w-full overflow-y-auto h-screen">
        {isLoading && (
          <div className=" w-32 h-fit text-center m-auto pt-2 mt-12">
            <p className="text-neutral-600 animate-bounce">Please wait...</p>
          </div>
        )}
        {display}
      </div>
    </div>
  );
}
