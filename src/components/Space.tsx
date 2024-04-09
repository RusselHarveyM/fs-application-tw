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
import { useState, useContext, useEffect, useRef } from "react";

import { DataContext } from "@/data/data-context";
import Modal from "./Modal";
import { Input } from "./ui/input";
import ImageDisplay from "./ImageDisplay";

import evaluate from "../helper/evaluate";
import comment from "../helper/comment";

import Comment from "./Comment";

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

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
  assessmentDuration: 0,
  isLoad: false,
  isUpload: false,
  isAssess: false,
};

export default function Space({ data }) {
  const { spaceImages, ratings, useEntry } = useContext(DataContext);
  const [space, setSpace] = useState(SPACE_DEFINITION);
  const uploadModal = useRef();
  const selectedUploadImages = useRef();
  const deleteModal = useRef();
  const timer = useRef<NodeJS.Timeout | undefined>();
  const duration = useRef();

  const { toast } = useToast();

  useEffect(() => {
    console.log("im in");
    let prevTimer = timer.current;
    if (timer.current) {
      timer.current = undefined;
      clearInterval(timer.current);
      toast({
        title: "Task is Complete",
        variant: "success",
        description: "Assessment Task is complete!",
        action: <ToastAction altText="dismiss">Dismiss</ToastAction>,
      });
    }
    if (space.selectedImage === undefined) {
      toast({
        title: "Image Deleted",
        variant: "destructive",
        action: <ToastAction altText="dismiss">Dismiss</ToastAction>,
      });
    }
    if (space.isUpload) {
      toast({
        title: "Task is Complete",
        variant: "success",
        description: "Upload Task is complete!",
        action: <ToastAction altText="dismiss">Dismiss</ToastAction>,
      });
    }
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
        isAssess: false,
        selectedImage: "",
        assessmentDuration: prevTimer ? duration.current : 0,
      };
    });
  }, [spaceImages, ratings]);

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

  function showModal(type) {
    if (type === "upload") {
      uploadModal.current.open();
    }
    if (type === "delete") {
      deleteModal.current.open();
    }
  }

  function handleImageDelete() {
    let action = {
      type: "spaceimages",
      method: "delete",
      data: {
        imageId: space.selectedImage.id,
        spaceId: space.id,
      },
    };
    useEntry(action);
    setSpace((prev) => {
      // const newPictures = prev.pictures.filter(
      //   (picture) => picture.id !== prev.selectedImage.id
      // );
      return {
        ...prev,
        // pictures: newPictures,
        selectedImage: undefined,
      };
    });
  }

  async function handleAssessBtn() {
    const images = [
      space.pictures.map((picture) => "data:image/png;base64," + picture.image),
    ];
    setSpace((prev) => {
      return {
        ...prev,
        isAssess: true,
      };
    });

    duration.current = 0;
    timer.current = setInterval(() => {
      duration.current += 1;
    }, 1000);
    const raw5s = await evaluate(images);
    comment(raw5s);
    console.log(" III raw5s III", raw5s);

    // const { sort, set, shine } = raw5s.comment;
    const { score: sortScore } = raw5s.result.sort;
    const { score: setScore } = raw5s.result.set;
    const { score: shineScore } = raw5s.result.shine;

    const sortScoreFixed = parseFloat(sortScore.toFixed(1));
    const setScoreFixed = parseFloat(setScore.toFixed(1));
    const shineScoreFixed = parseFloat(shineScore.toFixed(1));

    console.log(" III data III", data);

    const totalScore = data.scores?.reduce(
      (acc, score) => acc + (score.sort + score.setInOrder + score.shine) / 3,
      0
    );

    let averageScore = totalScore / data.scores?.length;
    averageScore = Math.min(Math.max(averageScore, 1), 10);

    const newRate = {
      id: "",
      sort: sortScoreFixed,
      setInOrder: setScoreFixed,
      shine: shineScoreFixed,
      standarize: 0,
      sustain: 0,
      security: 0,
      isActive: true,
      spaceId: space.id,
    };

    let action = {
      type: "ratings",
      method: "post",
      data: {
        rate: newRate,
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
              onDelete={() => showModal("delete")}
              selectedImage={space.selectedImage}
            />
            <menu className="flex gap-4 justify-end">
              <Button
                variant="blue"
                onClick={() => showModal("upload")}
                disabled={
                  space.id === undefined || space.isUpload || space.isAssess
                    ? true
                    : false
                }
              >
                Upload
              </Button>
              <Button
                variant="blue"
                onClick={handleAssessBtn}
                disabled={
                  space.id === undefined || space.isUpload || space.isAssess
                    ? true
                    : false
                }
              >
                Assess
              </Button>
            </menu>
          </div>
          <ImageGallery
            isLoad={
              space.isUpload ||
              space.isAssess ||
              space.selectedImage === undefined
            }
            duration={space.assessmentDuration}
            images={space.pictures}
            onSelectImage={handleImageSelect}
          />
        </div>
        <div className="flex bg-white w-full gap-8 shadow-sm p-8 rounded-lg">
          <div className="flex flex-col gap-4 justify-center">
            <ScoreCard
              isLoad={space.isAssess}
              score={space.isLoad || space.isAssess ? 0 : space.rating?.sort}
            />
            <ScoreCard
              isLoad={space.isAssess}
              type="set"
              score={
                space.isLoad || space.isAssess ? 0 : space.rating?.setInOrder
              }
            />
            <ScoreCard
              isLoad={space.isAssess}
              type="shine"
              score={space.isLoad || space.isAssess ? 0 : space.rating?.shine}
            />
          </div>
          <Comment isLoad={space.isAssess} />
        </div>
      </div>
    </>
  );
}
