import { useState, useContext, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Space from "./Space";
import { checkMonth, getDateString, sortDate } from "@/helper/date";
import { isAdminLoggedIn } from "@/helper/auth";
import { DataContext } from "@/data/data-context";
import Modal from "./Modal";
import { CircleHelp } from "lucide-react";

type SpaceImage = {
  id: string;
  spaceId: string;
  image: string;
  modifiedDate: Date;
  forType: string;
  prediction: string;
};

type SpaceImagesBySpace = {
  id: string;
  pictures: SpaceImage[];
};

export default function SpacesTable({ data, ratings, dataByRoom }) {
  const { spaceImages } = useContext(DataContext);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [imagesBySpace, setImagesBySpace] = useState<SpaceImagesBySpace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const guideModal = useRef<any>();
  const isLoggedIn = isAdminLoggedIn();

  // useEffect(() => {
  //   if (!isLoggedIn) guideModal.current.open();
  // }, []);

  useEffect(() => {
    setIsLoading(false);
  }, [spaceImages]);

  const handleClickSpace = (clickedData) => {
    if (clickedData.id !== selectedId && !isLoading) {
      setSelectedId(clickedData.id);
      const foundData = imagesBySpace.find(
        (curr) => curr.id === clickedData.id
      );
      if (!foundData) setIsLoading(true);
    }
  };

  const handleImageStore = async (id, images) => {
    if (images.length === 0 || images[0]?.spaceId === id) {
      setImagesBySpace((prev) => {
        const updatedImages = [
          ...prev.filter((curr) => curr.id !== id),
          { id, images },
        ];
        return updatedImages;
      });
      setIsLoading(true);
    }
  };

  const handleLoading = (value) => {
    setIsLoading(value);
  };

  const handleImageDelete = async (id, spaceImageId) => {
    setImagesBySpace((prev) => {
      const newData = prev.filter((curr) => curr.id !== id);
      const foundData = prev.find((curr) => curr.id === id);
      if (foundData) {
        setIsLoading(true);
        const updatedImages = foundData.images.filter(
          (img) => img.id !== spaceImageId
        );
        newData.push({ ...foundData, images: updatedImages });
      }
      return newData;
    });
  };

  const foundSpace = data.find((curr) => curr.id === selectedId);
  const foundRatings = ratings?.filter((curr) => curr.spaceId === selectedId);
  const sortedRatings = sortDate(ratings);

  return (
    <>
      {/* {!isLoggedIn && (
        <Modal ref={guideModal} buttonVariant="rose" buttonCaption="Confirm">
          <div className="flex justify-center items-center gap-4 text-white text-xl mb-4 p-3 bg-rose-500">
            <h2>How to use</h2>
            <CircleHelp />
          </div>
        </Modal>
      )} */}

      <div className="md:w-[90rem] sm:w-[44rem] xs:w-[23rem] mx-auto bg-white shadow-sm rounded-lg mt-10 flex flex-col items-center justify-center md:p-6 xs:p-2">
        <Table>
          <TableCaption className="xs:text-[8px] md:text-base">
            A list of your recent spaces.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-rose-500 pointer-events-none md:text-base xs:text-[0.5rem]">
              <TableHead className="text-white xs:w-24 md:w-fit">
                Name
              </TableHead>
              {isLoggedIn && (
                <>
                  <TableHead className="text-center text-white">Sort</TableHead>
                  <TableHead className="text-center text-white">
                    Set In Order
                  </TableHead>
                  <TableHead className="text-center text-white">
                    Shine
                  </TableHead>
                </>
              )}
              <TableHead className="text-center text-white ">Status</TableHead>
              <TableHead className="text-right text-white xs:text-[0.4rem] xs:w-24 md:w-fit md:text-base">
                Last Checked
              </TableHead>
              <TableHead className="text-right text-white xs:text-[0.4rem] xs:w-24 md:w-fit md:text-base">
                Last Assessed
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((currData) => {
              const statusCss = `md:text-base sm:text-sm xs:text-[5px] w-fit rounded-lg xs:py-1 xs:px-2 md:py-2 md:px-4 ${
                checkMonth(currData.viewedDate) &&
                checkMonth(currData.assessedDate)
                  ? "bg-rose-500 text-white"
                  : "bg-rose-500 opacity-20 text-white"
              }`;
              const statusCaption =
                checkMonth(currData.viewedDate) &&
                checkMonth(currData.assessedDate)
                  ? "viewed"
                  : "not viewed";
              const viewedDate = currData?.viewedDate
                ? getDateString(currData.viewedDate)
                : "----";
              const assessedDate = currData?.assessedDate
                ? getDateString(currData.assessedDate)
                : "----";
              const foundRatingsByCurr = sortedRatings.find(
                (curr) => curr.spaceId === currData.id
              );

              return (
                <TableRow
                  key={currData.id}
                  onClick={() => handleClickSpace(currData)}
                  className={`md:text-base xs:text-[0.5rem] border-neutral-100 hover:bg-white ${
                    isLoading
                      ? "animate-pulse cursor-wait"
                      : "hover:cursor-pointer hover:bg-rose-50"
                  } ${
                    currData.id === selectedId
                      ? "bg-rose-50 hover:bg-rose-50"
                      : ""
                  }`}
                >
                  <TableCell className="font-medium text-neutral-600 xs:text-[6px] md:text-base">
                    {currData.name}
                  </TableCell>
                  {isLoggedIn && (
                    <>
                      <TableCell className="text-center text-neutral-700 font-bold">
                        {foundRatingsByCurr?.sort ?? "-"}
                      </TableCell>
                      <TableCell className="text-center text-neutral-700 font-bold">
                        {foundRatingsByCurr?.setInOrder ?? "-"}
                      </TableCell>
                      <TableCell className="text-center text-neutral-700 font-bold">
                        {foundRatingsByCurr?.shine ?? "-"}
                      </TableCell>
                    </>
                  )}
                  <TableCell className="text-center text-neutral-600 flex items-center justify-center xs:w-24 md:w-full">
                    <p className={statusCss}>{statusCaption}</p>
                  </TableCell>
                  <TableCell className="text-right text-neutral-600 xs:text-[6px] md:text-base">
                    {viewedDate}
                  </TableCell>
                  <TableCell className="text-right text-neutral-600 xs:text-[6px] md:text-base">
                    {assessedDate}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {selectedId && (
        <Space
          data={foundSpace}
          dataByRoom={dataByRoom}
          spaceId={selectedId}
          ratings={foundRatings}
          onStore={handleImageStore}
          onLoad={handleLoading}
          onDelete={handleImageDelete}
          loaded={imagesBySpace}
        />
      )}
    </>
  );
}
