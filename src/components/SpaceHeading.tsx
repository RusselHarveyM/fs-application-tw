import { checkMonth, getDateString } from "@/helper/date.js";
import { removeProperties } from "@/helper/object.js";
import { isAdminLoggedIn } from "@/helper/auth";
import Button from "./Button";
import Modal from "./Modal";
import { useRef } from "react";

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

  function handleCalibrationModal() {
    calibrationGuideRef.current.open();
  }

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
          <div className="overflow-auto h-[30rem]">
            <pre className="text-xs bg-neutral-100 h-fit  py-4 pl-8 shadow-inner text-neutral-700">
              <p className="border-l-4 border-rose-300 pl-2">
                {JSON.stringify(
                  removeProperties(JSON.parse(standard), [
                    "prediction",
                    "result",
                    "indexFrom",
                  ]),
                  null,
                  2
                )}
              </p>
            </pre>
          </div>
        </div>
      </Modal>
      <div className="flex flex-col bg-rose-500 md:w-full  gap-8 shadow py-8 md:px-16 sm:px-8 rounded-lg">
        <div className="flex justify-between">
          <div className="flex items-center gap-4 text-white text-2xl xs:ml-4 xs:text-xs">
            <h2 className="uppercase">{name ? name : "Space"}</h2>
            {name ? (
              <button
                onClick={handleCalibrationModal}
                disabled={!checkMonth(calibrationDate)}
                className={`text-xs ${
                  checkMonth(calibrationDate) ? "bg-white" : "bg-neutral-200"
                } py-2 px-4 rounded-2xl text-rose-500 font-semibold opacity-60`}
              >
                {checkMonth(calibrationDate) ? "Calibrated" : "Not Calibrated"}
              </button>
            ) : (
              ""
            )}
            <p className="text-xs text-white">
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
                  : checkMonth(assessedDate) === true &&
                    checkMonth(viewedDate) === false
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
