import CircularProgress from "./CircularProgress";
import Button from "./Button";

import Building from "../assets/building.png";
import Room from "../assets/room.png";
import Space from "../assets/space.png";
import { useState } from "react";
import ImageTab from "./ImageTab";

export default function DashboardContent() {
  const [content, setContent] = useState("buildings");

  function handleTabSelect(selected) {
    setContent(selected);
  }

  return (
    <div className="flex flex-col w-full m-auto h-screen py-6 px-8">
      <div className="flex justify-center items-center h-2/5 gap-56 mt-8 mb-16">
        <CircularProgress
          percent={10}
          title="overall"
          strokeColor="#1dd75b"
          trailColor="#b8f5cd"
        />
        <CircularProgress
          percent={10}
          title="completion"
          strokeColor="#4069e5"
          trailColor="#c5d1f7"
        />
      </div>
      <nav className="flex items-center justify-center h-1/6 mt-8 mb-16 ">
        <ul className="flex bg-stone-100 rounded-full py-2 px-2">
          <li>
            <Button onClick={() => handleTabSelect("buildings")}>
              <ImageTab
                img={Building}
                label="building"
                isSelected={content === "buildings"}
              />
            </Button>
          </li>
          <li>
            <Button onClick={() => handleTabSelect("rooms")}>
              <ImageTab
                img={Room}
                label="room"
                isSelected={content === "rooms"}
              />
            </Button>
          </li>
          <li>
            <Button onClick={() => handleTabSelect("spaces")}>
              <ImageTab
                img={Space}
                label="space"
                isSelected={content === "spaces"}
              />
            </Button>
          </li>
        </ul>
      </nav>
      <div className="flex h-4/6 bg-yellow-50">TAB CONTENT</div>
    </div>
  );
}
