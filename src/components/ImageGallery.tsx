export default function ImageGallery({ images, onSelectImage }) {
  let cssLoad = " animate-pulse";

  return (
    <div
      className={`grid grid-cols-4 grid-rows-5 w-1/3 h-[30rem] rounded-lg bg-neutral-100 ${
        images && images?.length > 0 ? undefined : cssLoad
      }`}
    >
      {images && images?.length > 0 ? (
        images.map((image: any, index: number) => {
          let css = "";
          if (index === 0) {
            css = "rounded-tl-lg";
          } else if (index === 3) {
            css = "rounded-tr-lg";
          } else if (index === 19) {
            css = "rounded-bl-lg";
          } else if (index === 23) {
            css = "rounded-br-lg";
          }

          return (
            <img
              key={image.id}
              src={`data:image/jpeg;base64,${image.image}`}
              alt="gallery-image"
              onClick={() => onSelectImage(image.image)}
              className={`h-full w-full object-fit rounded-bl  hover:scale-105 hover:cursor-pointer ${css}`}
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
