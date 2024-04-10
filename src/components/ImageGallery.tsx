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
      <p className="absolute m-2 bottom-2 right-2 text-neutral-600 text-xs">
        {duration.toFixed(2)}s
      </p>
      {isLoad && (
        <div className="absolute top-0 left-0 flex justify-center items-center  w-[25rem] h-[30rem] bg-neutral-50 opacity-90">
          <h3 className="text-neutral-600 ">
            Please wait<p className="animate-bounce">...</p>
          </h3>
        </div>
      )}

      {images && images?.length > 0
        ? images.map((imageObject: any) => {
            const imageData = {
              id: imageObject.image.id,
              image: imageObject.image.image,
              prediction: imageObject.prediction,
            };
            return (
              <img
                key={imageObject.image.id}
                src={`data:image/jpeg;base64,${imageObject.image.image}`}
                alt="gallery-image"
                onClick={() => onSelectImage(imageData)}
                className={`h-full w-full object-fit  hover:scale-105 hover:cursor-pointer`}
              />
            );
          })
        : !isLoad && (
            <div className="absolute top-0 left-0 flex justify-center items-center text-neutral-600 w-[25rem] h-[30rem]">
              <p>No Images yet...</p>
            </div>
          )}
    </div>
  );
}
