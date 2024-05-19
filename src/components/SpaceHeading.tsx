import { checkMonth, getDateString } from "@/helper/date.js";
import { removeProperties } from "@/helper/object.js";
import { getColor, isEmpty } from "@/helper/string.js";
import { isAdminLoggedIn } from "@/helper/auth";
import Button from "./Button";
import Modal from "./Modal";
import { useRef, useMemo } from "react";

export default function SpaceHeading({
  name,
  calibrationDate,
  viewedDate,
  assessedDate,
  onSpaceCheck,
  isLoad,
  standard,
}) {
  const calibrationGuideRef = useRef();
  const loggedIn = isAdminLoggedIn();

  const handleCalibrationModal = () => {
    calibrationGuideRef.current.open();
  };

  const countItemsRecursively = (items, counts = {}) => {
    items.forEach((item) => {
      const itemClass = item.class; // Adjust according to the actual key name for class
      counts[itemClass] = (counts[itemClass] || 0) + 1;
      if (item.children) {
        countItemsRecursively(item.children, counts);
      }
    });
    return counts;
  };

  const itemCounts = useMemo(() => {
    if (isEmpty(standard)) return {};

    const parsedStandard = JSON.parse(standard);
    return countItemsRecursively(parsedStandard);
  }, [standard]);

  const styledStandard = useMemo(() => {
    if (isEmpty(standard)) return [];

    const parsedStandard = JSON.parse(standard);
    return parsedStandard.map((item, index) => {
      const itemClass = item.class; // Adjust according to the actual key name for class
      const style = getColor(itemClass);
      return (
        <div key={index} className={`text-${style}-500`}>
          {JSON.stringify(
            removeProperties(item, ["prediction", "result", "indexFrom", "id"]),
            null,
            2
          )}
        </div>
      );
    });
  }, [standard]);

  return (
    <>
      <Modal
        ref={calibrationGuideRef}
        buttonVariant="rose"
        buttonCaption="Confirm"
        toggleClose={false}
      >
        <div className="p-8 px-12 w-[40rem] h-fit">
          <h2 className="text-rose-500 text-2xl font-semibold pb-2">
            Calibration Result
          </h2>
          <div className="overflow-auto h-[30rem] relative">
            <pre className="text-xs bg-neutral-100 h-fit py-4 pl-8 shadow-inner text-neutral-700">
              <div className="absolute right-0 p-4 bg-white rounded-lg text-sm">
                {Object.entries(itemCounts).map(([itemClass, count]) => {
                  const style = getColor(itemClass);
                  return (
                    <div
                      key={itemClass}
                      className={`flex items-center text-${style}-500`}
                    >
                      <span className="mr-2 scale-125" style={{ color: style }}>
                        •
                      </span>
                      {itemClass}: {count}
                    </div>
                  );
                })}
              </div>
              {!isEmpty(standard) && (
                <>
                  {"["}
                  <div className="pl-4">
                    {styledStandard.map((item, index) => (
                      <div key={index}>
                        {item}
                        {index < styledStandard.length - 1 ? "," : ""}
                      </div>
                    ))}
                  </div>
                  {"]"}
                </>
              )}
            </pre>
          </div>
        </div>
      </Modal>
      <div className="flex flex-col bg-rose-500 md:w-full gap-8 shadow py-8 md:px-16 sm:px-8 rounded-lg">
        <div className="flex justify-between">
          <div className="flex items-center gap-4 text-white text-2xl xs:ml-4 xs:text-xs">
            <h2 className="uppercase md:text-base sm:text-sm xs:text-[8px]">
              {name || "Space"}
            </h2>
            {name && (
              <button
                onClick={handleCalibrationModal}
                disabled={!checkMonth(calibrationDate)}
                className={`md:text-xs sm:text-[12px] xs:text-[6px] ${
                  checkMonth(calibrationDate) ? "bg-white" : "bg-neutral-200"
                } md:py-2 md:px-4 sm:py-2 sm:px-3  xs:py-1 xs:px-2 rounded-2xl text-rose-500 font-semibold opacity-60`}
              >
                {checkMonth(calibrationDate) ? "Calibrated" : "Not Calibrated"}
              </button>
            )}
            <p className="md:text-xs sm:text-[12px] xs:text-[6px] text-white">
              {calibrationDate ? getDateString(calibrationDate) : "---"}
            </p>
          </div>

          {loggedIn && (
            <Button
              variant="rose"
              onClick={onSpaceCheck}
              disabled={
                isLoad || (viewedDate === null && assessedDate === null)
                  ? true
                  : checkMonth(assessedDate) && !checkMonth(viewedDate)
                  ? false
                  : true
              }
            >
              Check
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
