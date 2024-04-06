export default function ImageGallery({ images, onSelectImage }) {
  let cssLoad = " animate-pulse";

  return (
    <div
      className={`grid grid-cols-4 grid-rows-5 w-1/3 h-[30rem] bg-neutral-100 ${
        images && images?.length > 0 ? undefined : cssLoad
      }`}
    >
      {images && images?.length > 0 ? (
        images.map((image: any) => {
          return (
            <img
              key={image.id}
              src={`data:image/jpeg;base64,${image.image}`}
              alt="gallery-image"
              onClick={() => onSelectImage(image.image)}
              className={`h-full w-full object-fit  hover:scale-105 hover:cursor-pointer`}
            />
          );
        })
      ) : (
        <p className="text-neutral-600 w-40 h-fit relative top-52 left-32">
          No Images yet...
        </p>
      )}
    </div>
  );
}
