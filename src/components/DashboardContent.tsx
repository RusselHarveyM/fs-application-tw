import Button from "./Button";
import BrickWallLayout from "./BrickWallLayout";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import ImageTab from "./ImageTab";
import dummy from "../data/test01.json";
import { DataContext } from "@/data/data-context";
import Building from "../assets/buildings.png";
import Room from "../assets/rooms.png";

export default function DashboardContent() {
  const [content, setContent] = useState({
    selectedTab: "buildings",
    buildingId: undefined,
    data: undefined,
  });

  const navigate = useNavigate();
  const { buildings, rooms, spaces } = useContext(DataContext);
  const params = useParams();

  useEffect(() => {
    setContent((prev) => ({
      ...prev,
      data: buildings,
    }));
  }, [buildings]);

  useEffect(() => {
    if (rooms && params.id) {
      const filteredRooms = rooms.filter(
        (room) => room.buildingId === params.id
      );
      setContent((prev) => ({
        ...prev,
        selectedTab: "rooms",
        data: filteredRooms,
      }));
    }
  }, [rooms, params.id]);

  function handleTabSelect(selected) {
    if (selected !== content.selectedTab) {
      const newData = selected === "buildings" ? buildings : rooms;
      setContent((prev) => ({
        ...prev,
        selectedTab: selected,
        data: newData,
      }));
    }
  }

  function handleContainerSelect(id) {
    if (content.selectedTab === "buildings") {
      const filteredRooms = rooms.filter((room) => room.buildingId === id);
      setContent({
        selectedTab: "rooms",
        buildingId: id,
        data: filteredRooms,
      });
    } else if (content.selectedTab === "rooms") {
      navigate(`/room/${id}`);
    }
  }

  return (
    <div className="flex flex-col w-full m-auto my-auto xs:p-4 sm:p-6 md:p-8 lg:p-12">
      <BrickWallLayout
        data={content.data || dummy}
        selectedTab={content.selectedTab}
        handleContainerSelect={handleContainerSelect}
        rooms={rooms}
        spaces={spaces}
      />

      <div className="fixed bottom-4 left-0 right-0 flex flex-col items-center justify-center sm:bottom-8 md:bottom-16">
        <menu className="flex justify-center items-center shadow-sm border-2 rounded-full py-2 px-4 w-full xs:w-[220px] sm:w-[150px] md:w-[220px]">
          <NavLink
            to="/home"
            className={`flex justify-center flex-col items-center w-[50%] ${
              content.selectedTab === "buildings" ? "font-bold" : ""
            }`}
            onClick={() => handleTabSelect("buildings")}
          >
            <ImageTab
              img={Building}
              label="building"
              isSelected={content.selectedTab === "buildings"}
              isDisabled={false}
            />
          </NavLink>
          <Button
            liCss="flex justify-center flex-col items-center w-[50%]"
            onClick={() => handleTabSelect("rooms")}
            cssAdOns={content.selectedTab === "rooms" ? "font-bold" : undefined}
            disabled={content.selectedTab === "rooms" ? false : true}
          >
            <ImageTab
              img={Room}
              label="room"
              isSelected={content.selectedTab === "rooms"}
              isDisabled={content.selectedTab === "rooms" ? false : true}
            />
          </Button>
        </menu>
        <p className="md:text-base sm:text-sm xs:text-xs mt-2">
          /{" "}
          <span className="">
            {content.selectedTab === "rooms" &&
              buildings.find((building) => {
                const id = content.buildingId || params.id;
                return building.id === id;
              })?.buildingName}
          </span>
        </p>
      </div>
    </div>
  );
}
