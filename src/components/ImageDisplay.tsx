import { Trash } from "lucide-react";

export default function ImageDisplay({ onDelete, selectedImage }) {
  return (
    <div className="grid grid-cols-1 grid-rows-1 bg-neutral-100 h-[26rem]">
      {selectedImage && (
        <Trash
          className="relative m-4 w-5 h-5 hover:cursor-pointer hover:text-red-500"
          onClick={onDelete}
        />
      )}

      {selectedImage ? (
        <img
          src={`data:image/jpeg;base64,${selectedImage.image}`}
          alt="space-image"
          className="h-[26rem] w-full object-fit rounded-lg"
        />
      ) : (
        <div className=" animate-pulse bg-neutral-100 rounded-lg ">
          <p className="text-neutral-600 w-fit mx-auto my-44">
            Click an image from the gallery
          </p>
        </div>
      )}
    </div>
  );
}
