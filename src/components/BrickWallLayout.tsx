import { useState } from "react";
import Container from "./Container";
interface DataItem {
  id: string;
  image?: string;
  buildingName?: string;
  roomNumber?: string;
  status?: string;
  buildingCode?: string;
}

interface Room {
  buildingId: string;
}

interface Space {
  roomId: string;
}

interface BrickWallLayoutProps {
  data: DataItem[];
  selectedTab: string;
  isLoad: boolean;
  handleContainerSelect: (id: string) => void;
  rooms: Room[];
  spaces: Space[];
}

const BrickWallLayout: React.FC<BrickWallLayoutProps> = ({
  data,
  selectedTab,
  isLoad,
  handleContainerSelect,
  rooms,
  spaces,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containersPerSlide = 14;

  // Calculate total number of slides
  const totalSlides = Math.ceil(data.length / containersPerSlide);

  // Determine which containers should be displayed on the current slide
  const startIndex = currentSlide * containersPerSlide;
  const endIndex = Math.min(startIndex + containersPerSlide, data.length);
  const currentSlideData = data.slice(startIndex, endIndex);

  return (
    <div className=" flex xs:flex-col xs:h-[20rem] xs:overflow-y-scroll md:overflow-x-hidden md:overflow-y-hidden gap-4 justify-center items-center md:mt-4 mx-auto xs:w-full sm:w-[22rem] md:w-full lg:w-[95rem] md:h-[30rem]">
      {currentSlideData.map((item, index) => (
        <div
          key={index}
          className={`flex ${
            index % 2 === 0 ? "flex-row" : "flex-row-reverse"
          } w-full justify-center flex-wrap gap-4`}
        >
          {Array.from({ length: index % 2 === 0 ? 3 : 4 }).map(
            (_, columnIndex) => {
              const dataIndex =
                startIndex + index * (index % 2 === 0 ? 3 : 4) + columnIndex;
              const dataItem = data[dataIndex];
              if (!dataItem) return null;

              let container;
              if (isLoad) {
                const { id } = dataItem;

                container = <Container key={id} />;
              } else {
                const { id, image, buildingName, roomNumber, status } =
                  dataItem;
                const title =
                  selectedTab === "buildings" ? buildingName : roomNumber;
                const code =
                  selectedTab === "buildings" ? dataItem.buildingCode : status;
                const childrens =
                  selectedTab === "buildings"
                    ? rooms.filter((curr) => curr.buildingId === id)
                    : spaces.filter((curr) => curr.roomId === id);
                container = (
                  <Container
                    key={id}
                    img={image}
                    title={title}
                    selectedTab={selectedTab}
                    noOfChildren={childrens.length}
                    code={code}
                    onClick={() => handleContainerSelect(id)}
                  />
                );
              }

              return container;
            }
          )}
        </div>
      ))}
      {/* Navigation buttons */}
      {totalSlides > 1 && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentSlide((prev) => prev - 1)}
            disabled={currentSlide === 0}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => prev + 1)}
            disabled={currentSlide === totalSlides - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BrickWallLayout;
