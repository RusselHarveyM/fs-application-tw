import { useState, useEffect } from "react";
import Container from "./Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  handleContainerSelect,
  rooms,
  spaces,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<DataItem[][]>([]);
  const containersPerSlide = 14;

  useEffect(() => {
    // Organize data into slides
    const newSlides: DataItem[][] = [];
    for (let i = 0; i < data.length; i += containersPerSlide) {
      newSlides.push(data.slice(i, i + containersPerSlide));
    }
    setSlides(newSlides);
  }, [data]);

  return (
    <Carousel>
      <CarouselContent>
        {slides.length === 0 && (
          <div className="flex m-auto md:h-[30rem] xs:h-[20rem] sm:h-[22rem]">
            <p className="m-auto h-fit w-fit text-neutral-700">No Data</p>
          </div>
        )}
        {slides.map((slideData, slideIndex) => (
          <CarouselItem
            key={slideIndex}
            className={slideIndex === currentSlide ? "block" : "hidden"}
          >
            <div className="grid mt-4 p-0 md:w-fit xs:w-[80%] mx-auto md:grid-cols-[repeat(13,minmax(0,120px))] md:grid-rows-[repeat(4,_120px)] xs:grid-rows-[repeat(4,_90px)] sm:grid-rows-[repeat(4,_150px)] justify-center  md:h-fit xs:h-[300px]  xs:overflow-y-scroll  items-center">
              {slideData.map((item, index) => (
                <div
                  className={`md:col-span-${
                    index < 3
                      ? `3 ${index === 0 && "md:col-start-3"} md:mr-10`
                      : index < 7
                      ? "3 md:ml-10 "
                      : index < 11
                      ? `3 ${index === 7 && "md:col-start-3"}`
                      : index < 15
                      ? "3 md:ml-4 "
                      : `3 ${index === 15 && "md:col-start-3"}`
                  }  flex items-center justify-center`}
                  key={item.id}
                >
                  <Container
                    key={item.id}
                    img={item.image}
                    title={
                      selectedTab === "buildings"
                        ? item.buildingName
                        : item.roomNumber
                    }
                    selectedTab={selectedTab}
                    noOfChildren={
                      selectedTab === "buildings"
                        ? rooms?.filter((curr) => curr.buildingId === item.id)
                            .length
                        : spaces?.filter((curr) => curr.roomId === item.id)
                            .length
                    }
                    code={
                      selectedTab === "buildings"
                        ? item.buildingCode
                        : item.status
                    }
                    onClick={() => handleContainerSelect(item.id)}
                  />
                </div>
              ))}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        className="absolute top-1/2 left-0 transform -translate-y-1/2 w-14 h-14 text-rose-500 hover:text-white hover:bg-rose-500"
        onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
        disabled={currentSlide === 0 || slides.length === 0}
      />
      <CarouselNext
        className="absolute top-1/2 right-0 transform -translate-y-1/2 w-14 h-14 text-rose-500 hover:text-white hover:bg-rose-500"
        onClick={() =>
          setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))
        }
        disabled={currentSlide === slides.length - 1 || slides.length === 0}
      />
    </Carousel>
  );
};

export default BrickWallLayout;
