import CircularProgress from "./CircularProgress";
import Button from "./Button";
import Container from "./Container";

import Building from "../assets/building.png";
import Room from "../assets/room.png";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import ImageTab from "./ImageTab";
import dummy from "../data/test01.json";

import { DataContext } from "@/data/data-context";

export default function DashboardContent() {
  const [content, setContent] = useState({
    selectedTab: "buildings",
    data: undefined,
  });
  const navigate = useNavigate();
  const { buildings, rooms } = useContext(DataContext);
  const params = useParams();

  useEffect(() => {
    setContent((prev) => {
      return {
        ...prev,
        data: buildings,
      };
    });
  }, [buildings]);

  useEffect(() => {
    if (rooms && params.id) {
      const filteredRooms = rooms.filter(
        (room) => room.buildingId === params.id
      );
      setContent(() => {
        return {
          selectedTab: "rooms",
          data: filteredRooms,
        };
      });
    }
  }, [params]);

  function handleTabSelect(selected) {
    if (selected !== content.selectedTab)
      setContent(() => {
        let newData;
        if (selected === "buildings") newData = buildings;
        else newData = rooms;
        return {
          selectedTab: selected,
          data: newData,
        };
      });
  }

  function handleContainerSelect(id) {
    if (content.selectedTab === "buildings") {
      const filteredRooms = rooms.filter((room) => room.buildingId === id);
      setContent(() => {
        return {
          selectedTab: "rooms",
          data: filteredRooms,
        };
      });
    } else if (content.selectedTab === "rooms") {
      navigate(`/room/${id}`);
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
          <NavLink
            to="/"
            className={`flex justify-center flex-col items-center ${
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
            <h3 className="text-neutral-600">Buildings</h3>
          </NavLink>
          <Button
            liCss="flex justify-center flex-col items-center"
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
            <h3 className="text-neutral-600">Rooms</h3>
          </Button>
        </menu>
      </div>
      <div className="flex flex-wrap justify-center pt-16 m-auto gap-4 w-[95rem] h-[40rem] rounded-[2rem] hover:cursor-pointer">
        {content.data?.length > 0 ? (
          content.data.map((item, index) => (
            <div
              key={index}
              className={`flex ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              } flex-wrap w-full justify-center gap-8`}
            >
              {Array.from({ length: index % 2 === 0 ? 3 : 4 }).map(
                (_, columnIndex) => {
                  const dataIndex = index * 4 + columnIndex;
                  const dataItem = content.data[dataIndex];
                  if (!dataItem) return null;
                  let id;
                  let img;
                  let title;
                  let code;
                  if (content.selectedTab === "buildings") {
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
        ) : content.data?.length === 0 ? (
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
