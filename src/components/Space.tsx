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
import { useState, useContext, useEffect, useRef } from "react";

import { DataContext } from "@/data/data-context";
import Modal from "./Modal";
import { Input } from "./ui/input";
import Popup from "./Popup";
import CircularProgress from "./CircularProgress";

const SPACE_DEFINITION = {
  id: undefined,
  name: "",
  pictures: undefined,
  roomId: undefined,
  selectedImage: "",
  rating: {
    sort: undefined,
    setInOrder: undefined,
    shine: undefined,
  },
  isLoad: false,
};

export default function Space({ data }) {
  const { spaceImages, ratings, useEntry } = useContext(DataContext);
  const [space, setSpace] = useState(SPACE_DEFINITION);
  const uploadModal = useRef();

  useEffect(() => {
    setSpace((prev) => {
      let latestRating = [];
      if (space.id !== undefined) {
        const matchedRatings = ratings.filter(
          (rating) => rating.spaceId === space.id
        );
        latestRating = matchedRatings.sort(
          (a, b) =>
            new Date(b.dateModified).getTime() -
            new Date(a.dateModified).getTime()
        )[0];
      }
      console.log("latestRating >>> ", latestRating);
      return {
        ...prev,
        pictures: space.id !== undefined && spaceImages,
        rating: space.id !== undefined && latestRating,
        isLoad: space.pictures !== undefined && false,
      };
    });
  }, [spaceImages]);

  function getSpaceData(id) {
    let action = {
      type: "spaceimages",
      method: "get",
      data: {
        id,
      },
    };
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
    getSpaceData(currentSpace.id);
    setSpace((prev) => {
      return {
        ...prev,
        ...currentSpace,
        isLoad: true,
      };
    });
  }

  function handleUploadClick(type) {
    if (type === "upload") {
      uploadModal.current.open();
    }
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // The result contains the data URL of the image
      const imgElement = document.getElementById("preview") as HTMLImageElement;
      console.log(imgElement.src);
      imgElement.src = reader.result as string;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function handleImageSubmit(event) {
    event.preventDefault();
    uploadModal.current.close();
    console.log(event);
    let value = event.target.form[0].value;
    let base64Value = btoa(value);
    console.log(base64Value);
    let action = {
      type: "spaceimages",
      method: "post",
      data: {
        id: space.id,
        file: base64Value,
      },
    };
    useEntry(action);
  }

  return (
    <>
      {space.isLoad && (
        <div className=" w-32 h-fit text-center m-auto pt-2 mt-2">
          <p className="text-neutral-600 animate-bounce">Please wait...</p>
        </div>
      )}
      <Modal
        buttonVariant="blue"
        buttonCaption="Submit"
        input={
          <>
            <Input id="picture" type="file" onChange={handleImageUpload} />
            <img id="preview" className="h-24 w-full object-contain" />
          </>
        }
        ref={uploadModal}
        onSubmit={handleImageSubmit}
      >
        <h2 className="text-neutral-500 text-xl mb-4">Upload an Image</h2>
      </Modal>
      <div className="flex flex-col gap-4 p-6 w-[82rem] mx-auto">
        <div className="flex flex-col bg-white w-full gap-8 shadow-sm py-8 px-16 rounded-lg">
          <div className="flex justify-between">
            <h2 className="text-neutral-600 text-2xl">
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
                    <SelectItem
                      key={curr.id}
                      value={curr.name}
                      className="hover:cursor-pointer"
                    >
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
                className=" h-[26rem] bg-neutral-100 rounded-lg list-image-none"
              />
            ) : (
              <div className=" h-[26rem] animate-pulse bg-neutral-100 rounded-lg ">
                <p className="text-neutral-600 w-fit mx-auto my-44">
                  Click an image from the gallery
                </p>
              </div>
            )}

            <menu className="flex gap-4 justify-end">
              <Button
                variant="blue"
                onClick={() => handleUploadClick("upload")}
                disabled={space.id === undefined ? true : false}
              >
                Upload
              </Button>
              <Button
                variant="blue"
                disabled={space.id === undefined ? true : false}
              >
                Assess
              </Button>
            </menu>
          </div>
          <ImageGallery
            images={space.pictures}
            onSelectImage={handleImageSelect}
          />
        </div>
        <div className="flex bg-white w-full gap-8 shadow-sm p-8 rounded-lg">
          <div className="flex flex-col gap-4 justify-center">
            <ScoreCard score={space.isLoad ? 0 : space.rating?.sort} />
            <ScoreCard
              type="set"
              score={space.isLoad ? 0 : space.rating?.setInOrder}
            />
            <ScoreCard
              type="shine"
              score={space.isLoad ? 0 : space.rating?.shine}
            />
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
    </>
  );
}
