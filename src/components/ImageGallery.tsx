import { Circle } from "rc-progress";
import { Skeleton } from "./ui/skeleton";
import { Images } from "lucide-react";

export default function ImageGallery({
  images,
  onSelectImage,
  isLoad,
  duration,
}) {
  let cssLoad = " animate-pulse";
  let allFlag = 0;

  return (
    <div
      className={`grid md:grid-cols-4 md:grid-rows-5 sm:grid-cols-7 sm:grid-rows-2 xs:grid-cols-5 xs:grid-rows-4 md:w-1/3 sm:w-full xs:w-full shadow-inner md:h-[30rem] sm:h-[10rem] ${
        isLoad ? "bg-neutral-400 " : "bg-neutral-100"
      }  ${
        (images && images?.length > 0) || isLoad ? undefined : cssLoad
      } relative`} // Add relative here to position the child absolute elements
    >
      <Images className="absolute sm:w-28 sm:h-28 w-40 h-40 xs:w-28 xs:h-28 xs:left-24 xs:top-2 sm:top-5 sm:left-60 md:left-40 md:top-40 top-40 left-32 text-neutral-200 opacity-50" />
      {isLoad && (
        <div className="absolute top-0 left-0 flex justify-center items-center w-[27rem] h-[30rem] sm:w-full sm:h-full xs:w-full xs:h-full bg-neutral-50 opacity-90">
          <h3 className="text-neutral-600 ">
            Please wait<p className="animate-bounce">...</p>
          </h3>
        </div>
      )}

      {images && images?.length > 0
        ? images.map((imageObject: any) => {
            let tag = "all";
            if (imageObject.forType === "all" && allFlag === 0) {
              allFlag = 1;
            } else if (imageObject.forType !== "std") {
              tag = "sub";
            } else {
              tag = imageObject.forType;
            }
            const imageData = {
              id: imageObject.id,
              image: imageObject.image,
              prediction: imageObject.prediction,
            };
            const css =
              tag !== "all"
                ? "border-purple-400 text-white bg-purple-300"
                : "border-orange-400 text-white bg-orange-300";
            return (
              <div
                key={imageObject.id}
                className={`relative ${
                  isLoad
                    ? "opacity-50"
                    : " hover:cursor-pointer hover:scale-105"
                }  `}
              >
                {isLoad && (
                  <Circle
                    percent={50}
                    trailWidth={18}
                    strokeWidth={18}
                    strokeLinecap="butt"
                    trailColor={"#fff"}
                    strokeColor={"#000"}
                    className="animate-spin absolute w-5 h-5 left-1 top-1"
                  />
                )}

                <img
                  src={`data:image/jpeg;base64,${imageObject.image}`}
                  alt="gallery-image"
                  onClick={() => onSelectImage(imageData)}
                  className={`h-full w-full object-fit `}
                />
                <sup
                  className={
                    "absolute md:top-16 sm:top-14 xs:top-3 right-1 md:h-6 xs:h-2 xs:w-6 xs:text-[0.6] w-fit py-1 px-1 flex justify-center items-center rounded-lg border-4 uppercase font-bold md:text-md " +
                    css
                  }
                >
                  {tag}
                </sup>
              </div>
            );
          })
        : !isLoad && (
            <div className="absolute top-0 left-0 flex justify-center items-center text-neutral-600 w-[27rem] h-[30rem]">
              <p>No Images yet...</p>
            </div>
          )}
    </div>
  );
}
