import CircularProgress from "./CircularProgress";
import Button from "./Button";
import Container from "./Container";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import ImageTab from "./ImageTab";
import dummy from "../data/test01.json";
import { DataContext } from "@/data/data-context";
import Building from "../assets/building.png";
import Room from "../assets/room.png";

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
    <div className="flex flex-col w-full m-auto xs:py-28 xs:px-4 sm:py-6 sm:px-8 mb-18">
      {/* <div className="flex gap-8 mt-4 mb-8 lg:flex-row lg:justify-center lg:gap-56 md:gap-50 md:justify-center md:flex-row md:gap-16 sm:flex-row sm:justify-center sm:gap-26">
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
      </div> */}

      <div className="flex flex-col gap-4 justify-center items-center mt-4  m-auto  xs:w-[22rem] xs:h-[10rem] sm:w-full sm:h-[20rem] md:w-[95rem] md:h-[30rem] rounded-[2rem]">
        {content.data?.length > 0 ? (
          content.data.map((item, index) => {
            let contentLength = content.data?.length;
            let length =
              contentLength <= 3
                ? 1
                : contentLength <= 7
                ? 2
                : contentLength <= 10
                ? 3
                : 4;
            if (index < length)
              return (
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
                      const id = dataItem.id;
                      const img = dataItem.image;
                      const title =
                        content.selectedTab === "buildings"
                          ? dataItem.buildingName
                          : dataItem.roomNumber;
                      const code =
                        content.selectedTab === "buildings"
                          ? dataItem.buildingCode ?? ""
                          : "";
                      return (
                        <Container
                          key={id}
                          img={img}
                          title={title}
                          code={code}
                          onClick={() => handleContainerSelect(id)}
                        />
                      );
                    }
                  )}
                </div>
              );
          })
        ) : content.data?.length === 0 ? (
          <p className="text-neutral-500">The building is empty</p>
        ) : (
          dummy &&
          dummy.map((item, index) => {
            let contentLength = content.data?.length;
            let length =
              contentLength <= 3
                ? 1
                : contentLength <= 7
                ? 2
                : contentLength <= 10
                ? 3
                : 4;
            if (index < length)
              return (
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
                      const id = dataItem.id;
                      return <Container key={id} />;
                    }
                  )}
                </div>
              );
          })
        )}
      </div>

      {/* <div className="flex flex-col gap-8 items-center justify-center h-1/6  "> */}
      <div className="xs:fixed xs:bottom-28 xs:left-0 xs:right-0 sm:bottom-44 md:bottom-10 flex flex-col gap-8 items-center justify-center sm:py-10 md:-mb-4">
        <menu className="flex justify-center items-center bg-stone-100 rounded-full py-2 px-4 md:w-[250px] md:h-[120px] sm:w-[190] sm:h-[90] xs:w-[190] xs:h-[90]">
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
            <h3 className="text-neutral-600 md:text-base sm:text-sm xs:text-xs">
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
                const id = content.buildingId || params.id;
                return building.id === id;
              })?.buildingName}
          </span>
        </p>
      </div>
    </div>
  );
}
