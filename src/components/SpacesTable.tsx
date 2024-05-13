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

export default function SpacesTable({ data, ratings }) {
  const { spaceImages } = useContext(DataContext);
  const [selectedId, setSelectedId] = useState(undefined);
  const [imagesBySpace, setImagesBySpace] = useState<SpaceImagesBySpace[]>([]);
  const [isLoad, setIsLoad] = useState<Boolean>(false);
  const guideModal = useRef();

  useEffect(() => {
    guideModal.current.open();
  }, []);

  useEffect(() => {
    setIsLoad(false);
  }, [spaceImages]);

  function handleClickSpace(clickedData) {
    if (clickedData.id !== selectedId && !isLoad) {
      setSelectedId(clickedData.id);
      const foundData = imagesBySpace.find(
        (curr) => curr.id === clickedData.id
      );
      if (!foundData) setIsLoad(true);
    }
  }

  async function handleImageStore(id, images) {
    if (images.length === 0 || images[0]?.spaceId === id) {
      const foundData = imagesBySpace.find((curr) => curr.id === id);
      setImagesBySpace((prev) => {
        let data = {
          id: id,
          images,
        };
        if (foundData) {
          const filteredData = imagesBySpace.filter((curr) => curr.id !== id);
          return [data, ...filteredData];
        }
        return [data, ...prev];
      });
      setIsLoad(true);
    }
  }

  function handleLoading(value) {
    setIsLoad(value);
  }

  async function handleImageDelete(id, spaceImageId) {
    const newData = [...imagesBySpace.filter((curr) => curr.id !== id)];
    const foundData = imagesBySpace.find((curr) => curr.id === id);
    if (foundData) {
      setIsLoad(true);
      setImagesBySpace(() => {
        const images = foundData?.images?.filter(
          (curr) => curr.id !== spaceImageId
        );
        const data = {
          ...foundData,
          images,
        };
        return [data, ...newData];
      });
    }
  }
  const foundSpace = data.find((curr) => curr.id === selectedId);

  const isLoggedIn = isAdminLoggedIn();

  const foundRatings = ratings?.filter((curr) => curr.spaceId === selectedId);

  const currRatings = sortDate(ratings);

  return (
    <>
      <Modal ref={guideModal} buttonVariant="rose" buttonCaption="Confirm">
        <div className="flex justify-center items-center gap-4 text-white text-xl mb-4 p-3 bg-rose-500">
          <h2>How to use</h2>
          <CircleHelp />
        </div>
      </Modal>
      <div className="md:w-[90rem] sm:w-[44rem] xs:w-[30rem] mx-auto bg-white shadow-sm rounded-lg mt-10 flex flex-col items-center justify-center p-6">
        <Table>
          <TableCaption>A list of your recent spaces.</TableCaption>
          <TableHeader>
            <TableRow className="bg-rose-500 pointer-events-none  md:text-base xs:text-xs">
              <TableHead className="w-[150px] text-white">Name</TableHead>
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
              <TableHead className="text-center text-white">Status</TableHead>
              <TableHead className="text-right text-white">
                Last Checked
              </TableHead>
              <TableHead className="text-right text-white">
                Last Assessed
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((currData) => {
              let statusCss = "w-fit rounded-lg py-2 px-4  bg-rose-500 ";
              let statusCaption = "not viewed";
              if (
                checkMonth(currData.viewedDate) &&
                checkMonth(currData.assessedDate)
              ) {
                statusCaption = "viewed";
                statusCss += "text-white  ";
              } else {
                statusCss += "opacity-20 text-white  ";
              }

              const viewedDate =
                currData?.viewedDate && currData?.assessedDate
                  ? getDateString(currData?.viewedDate)
                  : "----";

              const assessedDate = currData?.assessedDate
                ? getDateString(currData?.assessedDate)
                : "----";

              const foundRatingsByCurr = currRatings.find(
                (curr) => curr.spaceId === currData.id
              );

              return (
                <TableRow
                  key={currData.id}
                  onClick={() => handleClickSpace(currData)}
                  className={`  md:text-base xs:text-xs border-neutral-100 hover:bg-white${
                    isLoad
                      ? " animate-pulse cursor-wait"
                      : " hover:cursor-pointer hover:bg-rose-50"
                  } ${
                    currData.id === selectedId && "bg-rose-50 hover:bg-rose-50"
                  }`}
                >
                  <TableCell className="font-medium text-neutral-600">
                    {currData?.name}
                  </TableCell>
                  {isLoggedIn && (
                    <>
                      <TableCell className="text-center text-neutral-700 font-bold">
                        {foundRatingsByCurr ? foundRatingsByCurr?.sort : "-"}
                      </TableCell>
                      <TableCell className="text-center text-neutral-700 font-bold">
                        {foundRatingsByCurr
                          ? foundRatingsByCurr?.setInOrder
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center text-neutral-700 font-bold">
                        {foundRatingsByCurr ? foundRatingsByCurr?.shine : "-"}
                      </TableCell>
                    </>
                  )}

                  <TableCell className="text-center text-neutral-600 flex items-center justify-center">
                    <p className={`${statusCss}`}>{statusCaption}</p>
                  </TableCell>
                  <TableCell className="text-right text-neutral-600">
                    {viewedDate}
                  </TableCell>
                  <TableCell className="text-right text-neutral-600">
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
