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
import { useParams } from "react-router-dom";

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
  standard: "",
  selectedScore: "",
  rating: [],
  assessmentDuration: 0,
  isLoad: false,
  isUpload: false,
  isAssess: false,
};

export default function Space({ data }) {
  const { rooms, spaceImages, ratings, useEntry } = useContext(DataContext);
  const [space, setSpace] = useState(SPACE_DEFINITION);
  const [selectedRating, setSelectedRating] = useState(undefined);
  // const [model, setModel] = useState(undefined);
  const uploadModal = useRef();
  const forSTDRef = useRef();
  const forALLRef = useRef();
  const cameraInputRef = useRef(null);
  const selectedUploadImages = useRef();
  const deleteModal = useRef();
  const timer = useRef<NodeJS.Timeout | undefined>();
  const duration = useRef();
  const params = useParams();
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
        const matchedRatings = ratings?.filter(
          (rating) => rating.spaceId === space.id
        );
        latestRating = matchedRatings?.sort(
          (a, b) =>
            new Date(b.dateModified).getTime() -
            new Date(a.dateModified).getTime()
        );
        console.log("latestRating >>> ", latestRating);
        setSelectedRating(latestRating ? latestRating[0] : []);
      }
      return {
        ...prev,
        pictures:
          prev.id !== undefined && !prev.isAssess
            ? spaceImages?.map((spi) => {
                return {
                  image: spi,
                  prediction: JSON.parse(spi.prediction),
                  forType: spi.forType,
                };
              })
            : prev.pictures,
        rating: prev.id !== undefined ? latestRating : [],
        isLoad: prev.pictures !== undefined && false,
        isUpload: false,
        isAssess: false,
        selectedImage: "",
        selectedScore: "",
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
    let type = forSTDRef.current.checked
      ? forSTDRef.current.value
      : // : forALLRef.current.checked
        // ? forALLRef.current.value
        "all";

    forSTDRef.current.checked = false;
    // forALLRef.current.checked = false;

    uploadModal.current.close();
    let action = {
      type: "spaceimages",
      method: "post",
      data: {
        spaceId: space.id,
        forType: type,
        prediction: "",
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
      ...space.pictures.map((imageObject) => {
        return {
          image: "data:image/png;base64," + imageObject.image.image,
          forType: imageObject.image.forType,
        };
      }),
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
    const raw5s = await evaluate(images, space?.name, space?.standard);
    if (raw5s.standard === "") {
      // if not calibrating
      console.log("predictions >> ", raw5s.predictions);

      const commentResult = comment(raw5s);
      console.log(" III commentResult III", commentResult);
      const { sort, set, shine } = commentResult;
      console.log(" III raw5s III", raw5s);

      // const { sort, set, shine } = raw5s.comment;
      const { score: sortScore } = raw5s.scores.sort;
      const { score: setScore } = raw5s.scores.set;
      const { score: shineScore } = raw5s.scores.shine;

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

      let scores = {
        spaceId: space.id,
        sort: sortScoreFixed,
        setInOrder: setScoreFixed,
        shine: shineScoreFixed,
        comment: {
          sort: sort,
          setInOrder: set,
          shine: shine,
        },
      };

      let action = {
        type: "ratings",
        method: "post",
        data: {
          scores,
        },
      };

      useEntry(action);
      setSpace((prev) => {
        let newPictures = [];
        for (let i = 0; i < prev?.pictures.length; i++) {
          newPictures.push({
            image: prev?.pictures[i].image,
            prediction: raw5s.predictions[i],
            forType: prev?.pictures[i].forType,
          });
          console.log("pic >> ", prev?.pictures[i]);
          let action = {
            type: "spaceimages",
            method: "put",
            data: {
              id: prev?.pictures[i].image.id,
              spaceId: prev?.pictures[i].image.spaceId,
              image: prev?.pictures[i].image.image,
              forType: prev?.pictures[i].image.forType,
              prediction: JSON.stringify(raw5s.predictions[i]),
            },
          };
          useEntry(action);
        }

        return {
          ...prev,
          pictures: newPictures,
        };
      });

      // edit room for user attended

      const roomId = params.id;
      const foundRoom = rooms.find((obj) => obj.id === roomId);
      const loginData = JSON.parse(localStorage.getItem("isLoggedIn"));

      console.log("loginData >> ", loginData);
      console.log("foundROOm >> ", foundRoom);
      let newAction = {
        type: "rooms",
        method: "put",
        data: {
          id: roomId,
          buildingId: foundRoom.buildingId,
          roomNumber: foundRoom.roomNumber,
          image: foundRoom.image,
          status: foundRoom.status,
          modifiedBy: [loginData.id, ...foundRoom.modifiedBy],
        },
      };

      useEntry(newAction);
    } else {
      // if calibrating
      console.log("raw5s >>> ", raw5s);
      console.log("calibrating");
      const roomId = params.id;
      const currentSpace = data.find((curr) => curr.name === space.name);
      let action = {
        type: "spaces",
        method: "put",
        data: {
          id: currentSpace.id,
          name: currentSpace.name,
          roomId: roomId,
          pictures: currentSpace.pictures,
          standard: raw5s.standard,
        },
      };
      useEntry(action);
      setSpace((prev) => {
        return {
          ...prev,
          standard: raw5s.standard,
          isAssess: false,
        };
      });
    }
  }

  function handleScoreClick(type) {
    setSpace((prev) => {
      return {
        ...prev,
        selectedScore: type,
      };
    });
  }

  function handleImageClose() {
    forSTDRef.current.checked = false;
    // forALLRef.current.checked = false;
  }

  const handleCameraClick = () => {
    cameraInputRef.current.click();
  };

  function handleResultSelect(selectedDate) {
    setSelectedRating(() => {
      const foundRating = space?.rating.find(
        (r) => r.dateModified === selectedDate
      );
      return foundRating;
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
              ref={cameraInputRef}
              capture="environment"
            />
            <fieldset className="flex width-full justify-around">
              <div className="flex gap-2 justify-center items-center">
                <input
                  ref={forSTDRef}
                  type="radio"
                  id="std"
                  name="choice"
                  value="std"
                />
                <label htmlFor="std" className="text-xs text-neutral-600">
                  STD
                </label>
              </div>
            </fieldset>
            <img id="preview" className="h-24 w-full object-contain" />
          </>
        }
        ref={uploadModal}
        onSubmit={handleImageSubmit}
        onClose={handleImageClose}
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
      </Modal>
      <div className="flex flex-col gap-4 p-6 w-[90rem] mx-auto">
        <div className="flex flex-col bg-white w-full gap-8 shadow-sm py-8 px-16 rounded-lg">
          <div className="flex justify-between">
            <div className="flex items-center gap-4 text-neutral-600 text-2xl">
              <h2 className="uppercase">{space.name ? space.name : "Space"}</h2>
              {space.name ? (
                <p
                  className={`text-xs ${
                    space.standard !== "" ? "bg-green-400" : "bg-neutral-400"
                  } py-2 px-4 rounded-2xl text-white font-semibold opacity-60`}
                >
                  {space.standard !== "" ? "Calibrated" : "Not Calibrated"}
                </p>
              ) : (
                ""
              )}
            </div>
            <Select
              onValueChange={(selectedName) => handleSpaceSelect(selectedName)}
              disabled={space.isLoad || space.isAssess}
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
              // model={model}
              onDelete={() => showModal("delete")}
              selectedImage={space.selectedImage}
            />
            <div className="flex justify-between">
              <menu className="flex gap-4 justify-end">
                {JSON.parse(localStorage.getItem("isLoggedIn")).role !==
                  "admin" && (
                  <>
                    {" "}
                    <Button
                      variant="blue"
                      onClick={() => showModal("upload")}
                      disabled={
                        space.id === undefined ||
                        space.isUpload ||
                        space.isAssess ||
                        space.isLoad
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
                        space.id === undefined ||
                        space.pictures === undefined ||
                        space.pictures?.length === 0 ||
                        space.isUpload ||
                        space.isAssess ||
                        space.isLoad
                          ? true
                          : false
                      }
                    >
                      {space?.standard === "" ? "Calibrate" : "Assess"}
                    </Button>
                  </>
                )}
              </menu>
            </div>
          </div>
          <ImageGallery
            isLoad={
              space.isUpload ||
              space.selectedImage === undefined ||
              space.isAssess
            }
            duration={space.assessmentDuration}
            images={space.pictures}
            onSelectImage={handleImageSelect}
          />
        </div>
        {JSON.parse(localStorage.getItem("isLoggedIn")).role === "admin" && (
          <>
            {space.isAssess && (
              <div className=" w-32 h-fit text-center m-auto pt-2 mt-2">
                <p className="text-neutral-600 animate-bounce">
                  Please wait...
                </p>
              </div>
            )}
            <div className="relative flex bg-white w-full gap-8 shadow-sm p-8 pt-20  rounded-lg">
              <div className="flex  w-full absolute top-5  ">
                <Select
                  onValueChange={(selectedDate) =>
                    handleResultSelect(selectedDate)
                  }
                  disabled={space.isLoad || space.isAssess}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Most Recent" />
                  </SelectTrigger>
                  <SelectContent>
                    {space?.rating?.map((r) => {
                      const date = new Date(r.dateModified);
                      const formattedDate = date.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      });
                      return (
                        <SelectItem
                          key={r.id}
                          value={r.dateModified}
                          className="hover:cursor-pointer"
                        >
                          {formattedDate}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-4 justify-center">
                <ScoreCard
                  isLoad={space.isAssess}
                  score={
                    space.isLoad || space.isAssess ? 0 : selectedRating?.sort
                  }
                  onClick={() => {
                    if (space.selectedScore !== "sort")
                      handleScoreClick("sort");
                  }}
                />
                <ScoreCard
                  isLoad={space.isAssess}
                  type="set"
                  score={
                    space.isLoad || space.isAssess
                      ? 0
                      : selectedRating?.setInOrder
                  }
                  onClick={() => {
                    if (space.selectedScore !== "set in order")
                      handleScoreClick("set in order");
                  }}
                />
                <ScoreCard
                  isLoad={space.isAssess}
                  type="shine"
                  score={
                    space.isLoad || space.isAssess ? 0 : selectedRating?.shine
                  }
                  onClick={() => {
                    if (space.selectedScore !== "shine")
                      handleScoreClick("shine");
                  }}
                />
              </div>
              <Comment
                isLoad={space.isAssess || space.isLoad}
                selected={space.selectedScore}
                ratingId={selectedRating?.id}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
