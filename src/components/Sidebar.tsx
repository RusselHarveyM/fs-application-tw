import { ArrowLeft, Box, Home, Tag } from "lucide-react";
import Button from "./Button";
import { Badge } from "./ui/badge";

export default function Sidebar({ onSelectTab, selectedTab }) {
  const highlightNavClass =
    "font-bold border-red-500 text-red-500 rounded-none";

  return (
    <aside className="flex flex-col py-4 px-2 gap-4 items-center w-[19rem] h-screen bg-white shadow-md">
      <Button liCss="justify-start w-full " cssAdOns="flex gap-2">
        <ArrowLeft /> backlink
      </Button>
      <div className="flex justify-around items-center w-[90%] h-24 mb-4 ">
        <img
          src=""
          alt=""
          className="w-20 h-20 object-fill rounded-md bg-stone-100"
        />
        <h2>Room Name</h2>
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
