import { Trash } from "lucide-react";
import TargetBox from "./TargetBox";
import { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getColor } from "@/helper/string.js";

interface ImageDisplayProps {
  onDelete: () => void;
  selectedImage: {
    prediction: any[];
    image: string;
  };
  isLoad: boolean;
}

export default function ImageDisplay({
  onDelete,
  selectedImage,
  isLoad,
}: ImageDisplayProps) {
  const imageRef = useRef<HTMLImageElement>(null);

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [selectedModel, setSelectedModel] = useState(undefined);

  const prediction = selectedImage && JSON.parse(selectedImage?.prediction);

  console.log("prediction >> ", prediction);

  const handleImageLoad = (event) => {
    setImageSize({
      width: event.target.naturalWidth,
      height: event.target.naturalHeight,
    });
  };

  function handleModelSelect(value) {
    let num;
    switch (value) {
      case "model1":
        num = 0;
        break;
      case "model2":
        num = 1;
        break;
      case "model3":
        num = 2;
        break;
      case "model4":
        num = 3;
        break;
      default:
        num = undefined;
    }
    setSelectedModel(num);
  }

  return (
    <div
      className={`relative grid grid-cols-1 grid-rows-1 shadow-inner sm:w-full bg-neutral-100 md:h-[26rem] sm:h-[20rem] xs:h-[12rem] ${
        isLoad && "animate-pulse"
      }`}
    >
      {selectedImage && !isLoad && (
        <>
          <div
            className={`z-50 m-4 w-5 h-5 relative p-4 rounded-full bg-white  `}
          >
            <Trash
              className=" absolute w-5 h-5 top-[6px] left-[6px] hover:cursor-pointer hover:text-red-500"
              onClick={onDelete}
            />
          </div>
          <div className={"absolute bottom-1 left-1 z-50"}>
            <Select onValueChange={(val) => handleModelSelect(val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="hover:cursor-pointer">
                  All
                </SelectItem>
                <SelectItem value="model1" className="hover:cursor-pointer">
                  General
                </SelectItem>
                <SelectItem value="model2" className="hover:cursor-pointer">
                  Order
                </SelectItem>
                <SelectItem value="model3" className="hover:cursor-pointer">
                  Belongings
                </SelectItem>
                <SelectItem value="model4" className="hover:cursor-pointer">
                  Tidiness
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      {prediction && (
        <TargetBox>
          {prediction.map((pred: any[], outerIndex: number) => {
            if (pred && pred.length > 0) {
              return pred.map((innerPrediction: any[], index: number) => {
                let style = getColor(innerPrediction.class);

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
                      className={`absolute rounded-sm border-2 border-${style}-500 bg-${style}-600 bg-opacity-20 ${
                        !isLoad &&
                        "hover:scale-105 hover:z-40 hover:cursor-pointer hover:brightness-105 hover:text-white"
                      }   `}
                    >
                      <p className={`bg-${style}-500 text-sm w-fit `}>
                        {innerPrediction.class}
                      </p>
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
          className="md:h-[26rem] sm:h-[20rem] xs:h-[12rem] w-full rounded-lg"
        />
      ) : (
        <div className="animate-pulse bg-neutral-100 rounded-lg ">
          <p className="text-neutral-600 w-fit mx-auto my-44 rounded-lg md:mt-48 sm:mt-40 xs:mt-20">
            Click an image from the gallery
          </p>
        </div>
      )}
    </div>
  );
}
