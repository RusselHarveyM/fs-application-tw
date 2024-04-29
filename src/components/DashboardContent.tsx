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
    buildingId: undefined,
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
      setContent((prev) => {
        return {
          ...prev,
          selectedTab: "rooms",
          data: filteredRooms,
        };
      });
    }
  }, [params]);

  function handleTabSelect(selected) {
    if (selected !== content.selectedTab)
      setContent((prev) => {
        let newData;
        if (selected === "buildings") newData = buildings;
        else newData = rooms;
        return {
          ...prev,
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
          buildingId: id,
          data: filteredRooms,
        };
      });
    } else if (content.selectedTab === "rooms") {
      navigate(`/room/${id}`);
    }
  }
  return (
    <div className="flex flex-col w-full m-auto py-6 px-8 mb-18">
      <div className="flex justify-center items-center sm:w-[30rem] md:w-full m-auto md:gap-56 sm:gap-28 mt-8 mb-16 ">
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
      <div className="flex flex-col gap-8 items-center justify-center h-1/6 my-8 ">
        <menu className="flex bg-stone-100 rounded-full py-2 px-4 md:w-[288px] md:h-[160px] sm:w-[190] sm:h-[90]">
          <NavLink
            to="/home"
            className={`flex justify-center flex-col items-center sm:w-[96px] md:w-[123.2px] ${
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
            <h3 className="text-neutral-600 md:text-base sm:text-sm ">
              Buildings
            </h3>
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
            <h3 className="text-neutral-600  md:text-base sm:text-sm">Rooms</h3>
          </Button>
        </menu>
        <p className="text-neutral-500">
          /{" "}
          <span className="text-neutral-600">
            {content.selectedTab === "rooms" &&
              buildings.find((building) => {
                let id;
                if (content.buildingId) id = content.buildingId;
                else id = params.id;
                return building.id === id;
              })?.buildingName}
          </span>
        </p>
      </div>
      <div className="flex flex-wrap justify-center pt-8 m-auto gap-4 sm:w-full sm:h-[20rem] md:w-[95rem] md:h-[40rem] rounded-[2rem] hover:cursor-pointer">
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
                  const dataIndex = index * 3 + columnIndex;
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
                  if (!dataItem) return null;

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
