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
import ImageDisplay from "./ImageDisplay";

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
  isUpload: false,
};

export default function Space({ data }) {
  const { spaceImages, ratings, useEntry } = useContext(DataContext);
  const [space, setSpace] = useState(SPACE_DEFINITION);
  const uploadModal = useRef();
  const selectedUploadImages = useRef();
  const deleteModal = useRef();

  useEffect(() => {
    console.log("im in");
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
        isUpload: false,
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
        selectedImage: "",
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
    selectedUploadImages.current = file;

    const files = Array.from(event.target.files);
    const reader = new FileReader();

    reader.onloadend = () => {
      // The result contains the data URL of the image
      const imgElement = document.getElementById("preview") as HTMLImageElement;
      imgElement.src = reader.result as string;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function handleImageSubmit(event) {
    event.preventDefault();
    uploadModal.current.close();
    let action = {
      type: "spaceimages",
      method: "post",
      data: {
        id: space.id,
        file: selectedUploadImages.current,
      },
    };
    useEntry(action);
    setSpace((prev) => {
      return {
        ...prev,
        isUpload: true,
      };
    });
  }

  function showOnDeleteMessage() {
    deleteModal.current.open();
  }

  function handleImageDelete() {
    let action = {
      type: "spaceimages",
      method: "delete",
      data: {
        id: space.selectedImage.id,
      },
    };
    useEntry(action);
    setSpace((prev) => {
      const newPictures = prev.pictures.filter(
        (picture) => picture.id !== prev.selectedImage.id
      );
      return {
        ...prev,
        pictures: newPictures,
        selectedImage: "",
      };
    });
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
            <Input
              id="picture"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageUpload}
              multiple
            />
            <img id="preview" className="h-24 w-full object-contain" />
          </>
        }
        ref={uploadModal}
        onSubmit={handleImageSubmit}
      >
        <h2 className="text-neutral-500 text-xl mb-4">Upload an Image</h2>
      </Modal>
      <Modal
        ref={deleteModal}
        buttonCaption="Delete"
        buttonVariant="red"
        onSubmit={handleImageDelete}
      >
        <h2 className="text-neutral-500 text-xl mb-4">
          Are you sure you want to delete this image?
        </h2>
        {/* <p className="text-red-300 text-md mb-6">
          *This action is irreversible*
        </p> */}
      </Modal>
      <div className="flex flex-col gap-4 p-6 w-[82rem] mx-auto">
        <div className="flex flex-col bg-white w-full gap-8 shadow-sm py-8 px-16 rounded-lg">
          <div className="flex justify-between">
            <h2 className="text-neutral-600 text-2xl">
              {space.name ? space.name : "Space"}
            </h2>
            <Select
              onValueChange={(selectedName) => handleSpaceSelect(selectedName)}
              disabled={space.isLoad}
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
            <ImageDisplay
              onDelete={showOnDeleteMessage}
              selectedImage={space.selectedImage}
            />
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
            isUpload={space.isUpload}
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
