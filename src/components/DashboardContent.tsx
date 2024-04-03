import CircularProgress from "./CircularProgress";
import Button from "./Button";
import Container from "./Container";

import Building from "../assets/building.png";
import Room from "../assets/room.png";
import { useEffect, useState } from "react";
import ImageTab from "./ImageTab";
import dummy from "../data/test01.json";

export default function DashboardContent({ buildings, rooms }) {
  const [content, setContent] = useState("buildings");
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(buildings);
  }, [buildings]);

  function handleTabSelect(selected) {
    if (selected === "buildings") setData(buildings);
    setContent(() => selected);
  }

  function handleContainerSelect(id) {
    if (content === "buildings") {
      const filteredRooms = rooms.filter((room) => room.buildingId === id);
      setData(filteredRooms);
      setContent(() => "rooms");
    }
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
            disabled={content === "rooms" ? false : true}
          >
            <ImageTab
              img={Room}
              label="room"
              isSelected={content === "rooms"}
              isDisabled={content === "rooms" ? false : true}
            />
            <h3 className="text-neutral-600">Rooms</h3>
          </Button>
        </menu>
      </div>
      <div className="flex flex-wrap justify-center pt-16 m-auto gap-4 w-[95rem] h-[40rem] rounded-[2rem] hover:cursor-pointer">
        {data?.length > 0 ? (
          data.map((item, index) => (
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
                  if (!dataItem) return null;
                  let id;
                  let img;
                  let title;
                  let code;
                  if (content === "buildings") {
                    id = dataItem?.id;
                    img = dataItem?.image;
                    title = dataItem?.buildingName;
                    code = dataItem?.buildingCode;
                  } else {
                    id = dataItem?.id;
                    img = dataItem?.image;
                    title = dataItem?.roomNumber;
                  }
                  return dataItem ? (
                    <Container
                      key={id}
                      img={img}
                      title={title}
                      code={code ?? ""}
                      onClick={() => handleContainerSelect(id)}
                      // noOfChildren={dataItem.noOfChildren}
                    />
                  ) : null;
                }
              )}
            </div>
          ))
        ) : data?.length === 0 ? (
          <p className="text-neutral-500">The building is empty</p>
        ) : (
          dummy &&
          dummy.map((item, index) => (
            <div
              key={index}
              className={`flex ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              } flex-wrap w-full justify-center gap-8`}
            >
              {Array.from({ length: index % 2 === 0 ? 3 : 4 }).map(
                (_, columnIndex) => {
                  const dataIndex = index * 4 + columnIndex;
                  const dataItem = dummy[dataIndex];
                  let id = dataItem?.id;
                  return dataItem ? <Container key={id} /> : null;
                }
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
