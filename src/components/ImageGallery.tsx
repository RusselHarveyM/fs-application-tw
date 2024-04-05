export default function ImageGallery({ images, onSelectImage }) {
  return (
    <div className="grid grid-cols-4 grid-rows-5 w-1/3 h-[30rem] bg-neutral-100 rounded-lg">
      {images && images?.length > 0 ? (
        images.map((image) => (
          <img
            key={image.id}
            src={`data:image/jpeg;base64,${image.image}`}
            alt="gallery-image"
            onClick={() => onSelectImage(image.image)}
            className="h-full w-full hover:scale-105 hover:cursor-pointer"
          />
        ))
      ) : (
        <article className="text-neutral-500 text-lg w-40 h-fit relative top-52 left-32">
          <p>No Images yet</p>
          <p className="animate-bounce text-2xl w-fit h-fit">...</p>
        </article>
      )}
    </div>
  );
}
