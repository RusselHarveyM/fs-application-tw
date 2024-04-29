import {
  AlignJustify,
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRightToLine,
  Box,
  Home,
  Tag,
} from "lucide-react";
import Button from "./Button";

import { NavLink } from "react-router-dom";

import { useState } from "react";

export default function Sidebar({
  onSelectTab,
  selectedTab,
  roomData,
  buildingData,
  isLoad = false,
}) {
  const [isCollapse, setIsCollapse] = useState(false);
  const highlightNavClass =
    "font-bold border-red-500 text-red-500 rounded-none";

  function handleCollapsiblePress() {
    setIsCollapse(!isCollapse);
  }

  return (
    <div className="flex relative">
      {!isCollapse && (
        <aside className="flex flex-col py-8 px-2 gap-4 items-center md:w-[19rem] h-screen bg-white shadow-md sm:absolute md:static sm:z-50 sm:w-[13rem]">
          <NavLink
            to={`/home/${buildingData?.id}`}
            className={
              "justify-start md:w-[90%] sm:text-sm  md:text-base flex gap-2 hover:text-red-500"
            }
          >
            <ArrowLeft />
            {isLoad ? (
              <h2 className="animate-pulse md:w-40 sm:w-28 rounded h-5 bg-neutral-300 text-xl text-neutral-600" />
            ) : (
              buildingData?.buildingName
            )}
          </NavLink>
          <div className="flex gap-4 items-center w-[90%] h-24 mb-4 mt-4 ">
            {isLoad ? (
              <>
                <div className="animate-pulse md:w-20 md:h-20 sm:w-16 sm:h-16 object-fill rounded-md bg-neutral-300"></div>
                <h2 className="animate-pulse w-32 rounded h-5 bg-neutral-300 text-xl text-neutral-600" />
              </>
            ) : (
              <>
                <img
                  src={`data:image/jpeg;base64,${roomData?.image}`}
                  alt="room-image"
                  className="sm:w-16  sm:h-16 md:w-20 md:h-20 object-fill rounded-md bg-stone-100"
                />
                <h2 className="sm:text-md md:text-xl text-neutral-600">
                  {roomData.roomNumber}
                </h2>
              </>
            )}
          </div>
          <menu className="flex w-[90%] gap-2 pt-8 border-t-2 border-neutral-100 flex-col justify-start">
            <Button
              cssAdOns={`flex gap-2 ${
                selectedTab === "overview" ? highlightNavClass : undefined
              }`}
              onClick={() => onSelectTab("overview")}
              disabled={isLoad}
            >
              <Home />
              Overview
            </Button>
            <Button
              cssAdOns={`flex gap-2 ${
                selectedTab === "spaces" ? highlightNavClass : undefined
              }`}
              onClick={() => onSelectTab("spaces")}
              disabled={isLoad}
            >
              <Box />
              Spaces
            </Button>
            <Button
              cssAdOns={`flex gap-2 ${
                selectedTab === "redtags" ? highlightNavClass : undefined
              }`}
              onClick={() => onSelectTab("redtags")}
              disabled={isLoad}
            >
              <Tag />
              Red Tags
            </Button>
          </menu>
        </aside>
      )}

      <div
        onClick={handleCollapsiblePress}
        className={`flex md:opacity-0 md:w-0 md:h-0 text-neutral-700 items-center ${
          isCollapse
            ? "left-0 h-12 w-12 bg-transparent bg-white rounded-full bg-opacity-75"
            : "left-52 h-full w-6 shadow"
        } justify-center   bg-neutral-50  absolute  z-50`}
      >
        {!isCollapse ? (
          <ArrowLeftToLine className="w-4" />
        ) : (
          <AlignJustify className="w-4" />
        )}
      </div>
    </div>
  );
}
