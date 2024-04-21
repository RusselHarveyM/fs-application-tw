import { Skeleton } from "./ui/skeleton";

export default function ImageGallery({
  images,
  onSelectImage,
  isLoad,
  duration,
}) {
  let cssLoad = " animate-pulse";
  return (
    <div
      className={`grid grid-cols-4 grid-rows-5 w-1/3 h-[30rem] bg-neutral-100 ${
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
            const imageData = {
              id: imageObject.image.id,
              image: imageObject.image.image,
              prediction: imageObject.prediction,
            };
            const css =
              imageObject.forType === "std"
                ? "border-green-500 text-white bg-green-300"
                : imageObject.forType === "ord"
                ? "border-purple-500 text-white bg-purple-300"
                : imageObject.forType === "cln"
                ? "border-yellow-500 text-white bg-yellow-300"
                : "border-orange-400 text-white bg-orange-300";
            return (
              <div
                key={imageObject.image.id}
                className="relative  hover:scale-105 hover:cursor-pointer"
              >
                <img
                  src={`data:image/jpeg;base64,${imageObject.image.image}`}
                  alt="gallery-image"
                  onClick={() => onSelectImage(imageData)}
                  className={`h-full w-full object-fit `}
                />
                <sup
                  className={
                    "absolute top-16 right-1  h-6 w-fit py-1 px-1 flex justify-center items-center rounded-lg border-4   uppercase font-bold text-md " +
                    css
                  }
                >
                  {imageObject.forType}
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
