export default function ImageGallery({ images }) {
  return (
    <div className="w-1/3 h-[30rem] bg-neutral-100 rounded-lg">
      {images.length > 0 ? (
        images.map(() => <img src="" alt="" />)
      ) : (
        <p className="text-neutral-500 text-lg w-fit mx-auto my-52">
          No Images yet...
        </p>
      )}
    </div>
  );
}
