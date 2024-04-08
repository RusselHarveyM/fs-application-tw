export default function ImageGallery({ images, onSelectImage, isUpload }) {
  let cssLoad = " animate-pulse";

  return (
    <div
      className={`grid grid-cols-4 grid-rows-5 w-1/3 h-[30rem] bg-neutral-100 ${
        (images && images?.length > 0) || isUpload ? undefined : cssLoad
      }`}
    >
      {isUpload ? (
        <div className="flex justify-center items-center  w-[25rem] h-[30rem] bg-neutral-50 relative  opacity-90">
          <h3 className="text-neutral-600 ">
            Uploading<p className="animate-bounce">...</p>
          </h3>
        </div>
      ) : undefined}
      {images && images?.length > 0
        ? images.map((image: any) => {
            const imageData = {
              id: image.id,
              image: image.image,
            };
            return (
              <img
                key={image.id}
                src={`data:image/jpeg;base64,${image.image}`}
                alt="gallery-image"
                onClick={() => onSelectImage(imageData)}
                className={`h-full w-full object-fit  hover:scale-105 hover:cursor-pointer`}
              />
            );
          })
        : !isUpload && (
            <div className="flex justify-center items-center text-neutral-600 w-[25rem] h-[30rem] relative">
              <p>No Images yet...</p>
            </div>
          )}
    </div>
  );
}
