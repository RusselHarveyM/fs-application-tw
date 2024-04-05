import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageGallery from "./ImageGallery";
import Button from "./Button";
import ScoreCard from "./ScoreCard";
import Details from "./Details";
import { useState, useContext, useEffect } from "react";

import { DataContext } from "@/data/data-context";

export default function Space({ data }) {
  const { spaceImages, useEntry } = useContext(DataContext);
  const [space, setSpace] = useState({
    id: undefined,
    name: "",
    pictures: [],
    roomId: undefined,
    selectedImage: "",
  });

  useEffect(() => {
    setSpace((prev) => {
      return {
        ...prev,
        pictures: spaceImages,
      };
    });
  }, [spaceImages]);

  function getSpaceImages(id) {
    const action = {
      type: "spaceimages",
      method: "get",
      data: {
        id,
      },
    };
    console.log(spaceImages);
    useEntry(action);
  }

  function handleImageSelect(image) {
    setSpace((prev) => {
      return {
        ...prev,
        selectedImage: image,
      };
    });
  }

  function handleSpaceSelect(selectedSpace) {
    const currentSpace = data.find((space) => space.name === selectedSpace);
    console.log(currentSpace);
    getSpaceImages(currentSpace.id);
    setSpace(currentSpace);
  }

  return (
    <div className="flex flex-col gap-4 p-6 w-[82rem] mx-auto">
      <div className="flex flex-col bg-white w-full gap-8 shadow-sm py-8 px-16 rounded-lg">
        <div className="flex justify-between">
          <h2 className="text-neutral-600 text-2xl font-bold">
            {space.name ? space.name : "Space"}
          </h2>
          <Select
            onValueChange={(selectedName) => handleSpaceSelect(selectedName)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a space" />
            </SelectTrigger>
            <SelectContent>
              {data.map((curr) => {
                return (
                  <SelectItem key={curr.id} value={curr.name}>
                    {curr.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex  bg-white w-full gap-8 shadow-sm p-8 rounded-lg">
        <div className="flex flex-col justify-between w-2/3">
          {space.selectedImage ? (
            <img
              src={`data:image/jpeg;base64,${space.selectedImage}`}
              alt="space-image"
              className=" h-[26rem] bg-neutral-100 rounded-xl list-image-none"
            />
          ) : (
            <div className=" h-[26rem] animate-pulse bg-neutral-100 rounded-xl ">
              <p className="text-neutral-600 w-fit mx-auto my-44">
                Click an image from the gallery
              </p>
            </div>
          )}

          <menu className="flex gap-4 justify-end">
            <Button variant="blue">Upload</Button>
            <Button variant="blue">Assess</Button>
          </menu>
        </div>
        <ImageGallery
          images={space?.pictures}
          onSelectImage={handleImageSelect}
        />
      </div>
      <div className="flex bg-white w-full gap-8 shadow-sm p-8 rounded-lg">
        <div className="flex flex-col gap-4 justify-center">
          <ScoreCard />
          <ScoreCard type="set" />
          <ScoreCard type="shine" />
        </div>
        <article className="flex flex-col gap-4 w-full h-90 border-dashed border-4 rounded-lg bg-neutral-100 py-4 px-6">
          <h2 className="uppercase text-xl font-semibold">SORT</h2>
          <Details
            title="Summary"
            text={` Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reprehenderit suscipit vero dolores fugiat natus tempora quidem
              voluptates libero, praesentium, atque aut? Pariatur, provident rem
              quod hic minus quis id non?`}
          />
          <Details
            title="Things to improve"
            text={` Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reprehenderit suscipit vero dolores fugiat natus tempora quidem
              voluptates libero, praesentium, atque aut? Pariatur, provident rem
              quod hic minus quis id non?`}
          />
        </article>
      </div>
    </div>
  );
}
