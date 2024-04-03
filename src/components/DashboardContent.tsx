import CircularProgress from "./CircularProgress";
import { Link } from 'react-router-dom';
import Button from "./Button";
import Container from "./Container";

import Building from "../assets/building.png";
import Room from "../assets/room.png";
import Space from "../assets/space.png";
import { useState } from "react";
import ImageTab from "./ImageTab";
import data from "../data/test01.json";

export default function DashboardContent() {
  const [content, setContent] = useState("buildings");
  
  const handleRefresh = () => {
    window.location.reload();
  };
  function handleTabSelect(selected) {
    setContent(selected);
  }

  return (
    <div className="flex flex-col w-full m-auto py-6 px-8 mb-20">
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
      <div className="flex items-center justify-center h-1/6 mt-8 mb-16 ">
        <menu className="flex bg-stone-100 rounded-full py-2 px-4">
          <Button
            liCss="flex justify-center flex-col items-center"
            onClick={() => handleTabSelect("buildings")}
            cssAdOns={content === "buildings" ? "font-bold" : undefined}
          >
            <ImageTab
              img={Building}
              label="building"
              isSelected={content === "buildings"}
              isDisabled={false}
            />
            <h3 className="text-neutral-600">Buildings</h3>
          </Button>
          <Button
            liCss="flex justify-center flex-col items-center"
            onClick={() => handleTabSelect("rooms")}
            cssAdOns={content === "rooms" ? "font-bold" : undefined}
            disabled={false}
          >
            <ImageTab
              img={Room}
              label="room"
              isSelected={content === "rooms"}
              isDisabled={true}
            />
            <h3 className="text-neutral-600">Rooms</h3>
          </Button>
          <Link to="/space">
            <Button
              liCss="flex justify-center flex-col items-center"
              onClick={() => handleTabSelect("spaces")}
              cssAdOns={content === "spaces" ? "font-bold" : undefined}
              disabled={false}
            >
              <ImageTab
                img={Space}
                label="space"
                isSelected={content === "spaces"}
                isDisabled={true}
              />
              <h3 className="text-neutral-600">Space</h3>
            </Button>
          </Link>
        </menu>
      </div>
      <div className="flex flex-wrap justify-center pt-16   m-auto  gap-4  w-[95rem] h-[40rem]  rounded-[2rem] hover:cursor-pointer">
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            } flex-wrap w-full justify-center gap-8`}
          >
            {Array.from({ length: index % 2 === 0 ? 3 : 4 }).map(
              (_, columnIndex) => {
                const dataIndex = index * 4 + columnIndex;
                const dataItem = data[dataIndex];
                return dataItem ? (
                  <Container
                    key={dataItem.id}
                    img={dataItem.image}
                    title={dataItem.title}
                    code={dataItem.code}
                    noOfChildren={dataItem.noOfChildren}
                  />
                ) : null;
              }
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
