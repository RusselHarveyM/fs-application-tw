import { Skeleton } from "./ui/skeleton";

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
      className={`grid md:grid-cols-4 md:grid-rows-5 sm:grid-cols-7 sm:grid-rows-2 md:w-1/3 sm:w-full md:h-[30rem] sm:h-[10rem] bg-neutral-100 ${
        (images && images?.length > 0) || isLoad ? undefined : cssLoad
      } relative`} // Add relative here to position the child absolute elements
    >
      {!isLoad ? (
        <p className="absolute m-2 bottom-2 right-2 text-neutral-600 text-xs">
          {duration.toFixed(2)}s
        </p>
      ) : (
        <Skeleton className="absolute m-2 bottom-2 right-2 w-20 h-6 z-40 bg-neutral-200" />
      )}

      {isLoad && (
        <div className="absolute top-0 left-0 flex justify-center items-center  w-[27rem] h-[30rem] bg-neutral-50 opacity-90">
          <h3 className="text-neutral-600 ">
            Please wait<p className="animate-bounce">...</p>
          </h3>
        </div>
      )}

      {images && images?.length > 0
        ? images.map((imageObject: any) => {
            console.log(imageObject);
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
                className="relative  hover:scale-105 hover:cursor-pointer"
              >
                <img
                  src={`data:image/jpeg;base64,${imageObject.image}`}
                  alt="gallery-image"
                  onClick={() => onSelectImage(imageData)}
                  className={`h-full w-full object-fit `}
                />
                <sup
                  className={
                    "absolute md:top-16 sm:top-14 right-1  h-6 w-fit py-1 px-1 flex justify-center items-center rounded-lg border-4   uppercase font-bold text-md " +
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
