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

  const selectItemCss = "hover:cursor-pointer xs:text-[7px] md:text-base";

  return (
    <div
      className={`relative grid grid-cols-1 grid-rows-1 shadow-inner sm:w-full bg-neutral-100 md:h-[26rem] sm:h-[20rem] xs:h-[12rem] ${
        isLoad && "animate-pulse"
      }`}
    >
      {selectedImage && !isLoad && (
        <>
          <div
            className={`z-50 m-4 md:w-5 md:h-5 xs:w-5 xs:h-5 relative md:p-4 rounded-full bg-white  `}
          >
            <Trash
              className=" absolute md:w-5 md:h-5 xs:w-3 xs:h-3 md:top-[6px] md:left-[6px] xs:top-[4px] xs:left-[4px] hover:cursor-pointer hover:text-red-500"
              onClick={onDelete}
            />
          </div>
          <div className={"absolute  bottom-1 left-1 z-50"}>
            <Select onValueChange={(val) => handleModelSelect(val)}>
              <SelectTrigger className="md:w-[180px] md:h-[40px] md:text-base xs:w-[80px] xs:h-[20px] xs:text-[7px] opacity-80">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className=" md:w-[180px] xs:w-[80px]">
                <SelectItem value="all" className={selectItemCss}>
                  All
                </SelectItem>
                <SelectItem value="model1" className={selectItemCss}>
                  General
                </SelectItem>
                <SelectItem value="model2" className={selectItemCss}>
                  Order
                </SelectItem>
                <SelectItem value="model3" className={selectItemCss}>
                  Belongings
                </SelectItem>
                <SelectItem value="model4" className={selectItemCss}>
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
                      className={`absolute rounded-sm md:border-2 sm:border-2 xs:border-[0.5px] border-${style}-500 bg-${style}-600 bg-opacity-20 ${
                        !isLoad &&
                        "hover:scale-105 hover:z-40 hover:cursor-pointer hover:brightness-105 hover:text-white"
                      }   `}
                    >
                      <p
                        className={`absolute md:-top-3 xs:-top-2 rounded bg-${style}-500 md:text-black bg-opacity-60 xs:text-white w-fit  xs:text-[5px] md:text-xs `}
                      >
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
          <p className="text-neutral-600 w-fit mx-auto my-44 rounded-lg md:mt-48 sm:mt-40 xs:mt-20 md:text-base sm:text-sm xs:text-[8px]">
            Click an image from the gallery
          </p>
        </div>
      )}
    </div>
  );
}
