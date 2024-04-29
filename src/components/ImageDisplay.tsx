import { Trash } from "lucide-react";
import TargetBox from "./TargetBox";
import { useRef, useState } from "react";

interface ImageDisplayProps {
  onDelete: () => void;
  selectedImage: {
    prediction: any[];
    image: string;
  };
}

export default function ImageDisplay({
  onDelete,
  selectedImage,
  model = undefined,
}: ImageDisplayProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const prediction = selectedImage && JSON.parse(selectedImage?.prediction);

  const handleImageLoad = (event) => {
    setImageSize({
      width: event.target.naturalWidth,
      height: event.target.naturalHeight,
    });
  };

  return (
    <div className="relative grid grid-cols-1 grid-rows-1 sm:w-full bg-neutral-100 h-[26rem]">
      {selectedImage && (
        <div className="z-50 m-4 w-5 h-5 relative p-4 rounded-full bg-neutral-200 bg-opacity-30 ">
          <Trash
            className=" absolute w-5 h-5 top-[6px] left-[6px] hover:cursor-pointer hover:text-red-500"
            onClick={onDelete}
          />
        </div>
      )}
      {prediction && (
        <TargetBox>
          {prediction.map((pred: any[], outerIndex: number) => {
            if (pred && pred.length > 0) {
              return pred.map((innerPrediction: any[], index: number) => {
                let style =
                  innerPrediction.class === "chair"
                    ? "border-green-400 bg-green-300"
                    : innerPrediction.class === "sofa"
                    ? "border-pink-400 bg-pink-300"
                    : innerPrediction.class === "desk"
                    ? "border-red-600 bg-red-500"
                    : innerPrediction.class === "litter"
                    ? "border-yellow-400 bg-yellow-300"
                    : innerPrediction.class == "personal belongings"
                    ? "border-blue-400 bg-blue-300"
                    : innerPrediction.class === "disorganized"
                    ? "border-purple-400 bg-purple-300"
                    : innerPrediction.class === "organized"
                    ? "border-neutral-400 bg-neutral-300"
                    : undefined;

                let selectedModel =
                  model === "model1"
                    ? 0
                    : model === "model2"
                    ? 1
                    : model === "model3"
                    ? 2
                    : model === "model4"
                    ? 3
                    : model === "model5"
                    ? 4
                    : undefined;

                if (
                  outerIndex === selectedModel ||
                  selectedModel === undefined
                ) {
                  const oldX = innerPrediction.x;
                  const oldY = innerPrediction.y;
                  const oldWidth = innerPrediction.width;
                  const oldHeight = innerPrediction.height;

                  const currentImageWidth = imageRef?.current?.width;
                  const currentImageHeight = imageRef?.current?.height;

                  const x = (oldX * currentImageWidth) / imageSize.width;
                  const y = (oldY * currentImageHeight) / imageSize.height;
                  const width =
                    (oldWidth * currentImageWidth) / imageSize.width;
                  const height =
                    (oldHeight * currentImageHeight) / imageSize.height;

                  return (
                    <div
                      key={index}
                      style={{
                        left: `${x - width / 2}px`,
                        top: `${y - height / 2}px`,
                        width: `${width}px`,
                        height: `${height}px`,
                      }}
                      className={`absolute rounded-sm border-4 ${style} opacity-60 hover:scale-105 hover:z-40 hover:cursor-pointer hover:brightness-105 hover:text-white `}
                    >
                      <p className={``}>{innerPrediction.class}</p>
                    </div>
                  );
                } else {
                  return null;
                }
              });
            } else {
              return null;
            }
          })}
        </TargetBox>
      )}

      {selectedImage ? (
        <img
          ref={imageRef}
          onLoad={handleImageLoad}
          src={`data:image/jpeg;base64,${selectedImage.image}`}
          alt="space-image"
          className="h-[26rem] w-full rounded-lg"
        />
      ) : (
        <div className="animate-pulse bg-neutral-100 rounded-lg ">
          <p className="text-neutral-600 w-fit mx-auto my-44 rounded-lg">
            Click an image from the gallery
          </p>
        </div>
      )}
    </div>
  );
}
