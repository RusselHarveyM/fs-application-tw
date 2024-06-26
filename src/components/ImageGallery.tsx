import { Circle } from "rc-progress";
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
      className={`grid md:grid-cols-4 md:grid-rows-5 sm:grid-cols-7 sm:grid-rows-2 xs:grid-cols-[repeat(5,minmax(0,70px))] xs:grid-rows-[repeat(4,minmax(0,40px))] md:w-1/3 sm:w-full xs:w-full shadow-inner md:h-[30rem] sm:h-[10rem] ${
        isLoad ? "bg-neutral-400 " : "bg-neutral-100"
      }  ${
        (images && images?.length > 0) || isLoad ? undefined : cssLoad
      } relative`} // Add relative here to position the child absolute elements
    >
      {isLoad ? (
        <div className="absolute top-0 left-0 flex justify-center items-center w-[27rem] h-[30rem] sm:w-full sm:h-full xs:w-full xs:h-full bg-neutral-50 opacity-90">
          <h3 className="text-neutral-600 md:text-base xs:text-[8px]">
            Please wait<p className="animate-bounce">...</p>
          </h3>
        </div>
      ) : (
        <Images className="absolute sm:w-28 sm:h-28 w-40 h-40 xs:w-[70px] xs:h-[70px] xs:left-28 xs:top-8 sm:top-5 sm:left-60 md:left-40 md:top-40 top-40 left-32 text-neutral-200 opacity-50" />
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
                    "absolute md:top-16 sm:top-14 xs:top-6 right-1 md:h-6 xs:h-2 xs:w-6 md:w-fit  w-fit py-1 px-1 flex justify-center items-center rounded-lg md:border-4 sm:border-2 xs:border-[0.5px] uppercase font-bold md:text-md xs:text-[5px] sm:text-sm " +
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
