export default function ImageGallery({ images }) {
  return (
    <div className="grid grid-cols-4 grid-rows-5 w-1/3 h-[30rem] bg-neutral-100 rounded-lg">
      {images.length > 0 ? (
        images.map((image) => (
          <img
            key={image.id}
            src={`data:image/jpeg;base64,${image.image}`}
            alt=""
            className="h-full w-full"
          />
        ))
      ) : (
        <p className="text-neutral-500 text-lg w-fit mx-auto my-52">
          No Images yet...
        </p>
      )}
    </div>
  );
}
