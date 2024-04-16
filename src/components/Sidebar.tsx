import { ArrowLeft, Box, Home, Tag } from "lucide-react";
import Button from "./Button";

import { NavLink } from "react-router-dom";

export default function Sidebar({
  onSelectTab,
  selectedTab,
  roomData,
  buildingData,
}) {
  const highlightNavClass =
    "font-bold border-red-500 text-red-500 rounded-none";

  return (
    <aside className="flex flex-col py-8 px-2 gap-4 items-center w-[19rem] h-screen bg-white shadow-md">
      <NavLink
        to={`/${buildingData?.id}`}
        className={"justify-start w-[90%] flex gap-2 hover:text-red-500"}
      >
        <ArrowLeft />
        {buildingData?.buildingName}
      </NavLink>
      <div className="flex gap-4 items-center w-[90%] h-24 mb-4 mt-4 ">
        <img
          src={`data:image/jpeg;base64,${roomData.image}`}
          alt="room-image"
          className="w-20 h-20 object-fill rounded-md bg-stone-100"
        />
        <h2 className="text-xl text-neutral-600">{roomData.roomNumber}</h2>
      </div>
      <menu className="flex w-[90%] gap-2 pt-8 border-t-2 border-neutral-100 flex-col justify-start">
        <Button
          cssAdOns={`flex gap-2 ${
            selectedTab === "overview" ? highlightNavClass : undefined
          }`}
          onClick={() => onSelectTab("overview")}
        >
          <Home />
          Overview
        </Button>
        <Button
          cssAdOns={`flex gap-2 ${
            selectedTab === "spaces" ? highlightNavClass : undefined
          }`}
          onClick={() => onSelectTab("spaces")}
        >
          <Box />
          Spaces
        </Button>
        <Button
          cssAdOns={`flex gap-2 ${
            selectedTab === "redtags" ? highlightNavClass : undefined
          }`}
          onClick={() => onSelectTab("redtags")}
        >
          <Tag />
          Red Tags
        </Button>
      </menu>
    </aside>
  );
}
