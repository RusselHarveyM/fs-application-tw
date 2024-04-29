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
import { useState, useContext, useEffect, useRef, useCallback } from "react";
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
  selectedRating: undefined,
};

export default function Space({ data }) {
  const { rooms, useEntry } = useContext(DataContext);
  const { toast } = useToast();
  const params = useParams();
  const uploadModal = useRef();
  const forSTDRef = useRef();
  const selectedUploadImages = useRef();
  const deleteModal = useRef();
  const timer = useRef<NodeJS.Timeout | undefined>();
  const duration = useRef();
  const [space, setSpace] = useState(SPACE_DEFINITION);
  // const [selectedRating, setSelectedRating] = useState(undefined);

  const loggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

  useEffect(() => {
    if (data) {
      setSpace((prev) => ({
        ...prev,
        ...data.space,
        rating: [...data.rating],
      }));
    }
  }, [data]);

  const getSpaceData = useCallback(
    (id) => {
      let action = {
        type: "spaceimages",
        method: "get",
        data: {
          id,
        },
      };
      useEntry(action);
    },
    [useEntry]
  );

  useEffect(() => {
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
      console.log(data?.rating);
      return {
        ...prev,
        pictures: data?.space.pictures ?? [],
        rating: data?.rating,
        isLoad: prev.pictures !== undefined && false,
        selectedRating: data?.rating[0],
        isUpload: false,
        isAssess: false,
        selectedImage: "",
        selectedScore: "",
        assessmentDuration: prevTimer ? duration.current : 0,
      };
    });
  }, [data]);

  const handleImageSelect = useCallback((image) => {
    setSpace((prev) => ({
      ...prev,
      selectedImage: image,
    }));
  }, []);

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    selectedUploadImages.current = file;

    const files = Array.from(event.target.files);
    const reader = new FileReader();

    reader.onloadend = () => {
      const imgElement = document.getElementById("preview") as HTMLImageElement;
      imgElement.src = reader.result as string;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }, []);

  const handleImageSubmit = useCallback(
    (event) => {
      event.preventDefault();
      let type = forSTDRef.current.checked ? forSTDRef.current.value : "all";

      forSTDRef.current.checked = false;

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
      setSpace((prev) => ({
        ...prev,
        isUpload: true,
      }));
    },
    [space.id, useEntry]
  );

  const showModal = useCallback((type) => {
    if (type === "upload") {
      uploadModal.current.open();
    }
    if (type === "delete") {
      deleteModal.current.open();
    }
  }, []);

  const handleImageDelete = useCallback(() => {
    let action = {
      type: "spaceimages",
      method: "delete",
      data: {
        imageId: space.selectedImage.id,
        spaceId: space.id,
      },
    };
    useEntry(action);
    setSpace((prev) => ({
      ...prev,
      selectedImage: undefined,
    }));
  }, [space.id, space.selectedImage, useEntry]);

  const handleAssessBtn = useCallback(async () => {
    const images = space.pictures.map((imageObject) => ({
      image: "data:image/png;base64," + imageObject.image,
      forType: imageObject.forType,
    }));
    setSpace((prev) => ({
      ...prev,
      isAssess: true,
    }));

    duration.current = 0;
    timer.current = setInterval(() => {
      duration.current += 1;
    }, 1000);
    const raw5s = await evaluate(images, space?.name, space?.standard);
    if (raw5s.standard === "") {
      const commentResult = comment(raw5s);
      const { sort, set, shine } = commentResult;
      const { score: sortScore } = raw5s.scores.sort;
      const { score: setScore } = raw5s.scores.set;
      const { score: shineScore } = raw5s.scores.shine;

      const sortScoreFixed = parseFloat(sortScore.toFixed(1));
      const setScoreFixed = parseFloat(setScore.toFixed(1));
      const shineScoreFixed = parseFloat(shineScore.toFixed(1));

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
          let action = {
            type: "spaceimages",
            method: "put",
            data: {
              id: prev?.pictures[i].id,
              spaceId: prev?.pictures[i].spaceId,
              image: prev?.pictures[i].image,
              forType: prev?.pictures[i].forType,
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

      const roomId = params.id;
      const foundRoom = rooms.find((obj) => obj.id === roomId);

      let newAction = {
        type: "rooms",
        method: "put",
        data: {
          id: roomId,
          buildingId: foundRoom.buildingId,
          roomNumber: foundRoom.roomNumber,
          image: foundRoom.image,
          status: foundRoom.status,
          modifiedBy: [loggedIn.id, ...foundRoom.modifiedBy],
        },
      };

      useEntry(newAction);
      newAction = {
        type: "spaces",
        method: "assessed",
        data: {
          id: data.space.id,
        },
      };
      useEntry(newAction);
    } else {
      const roomId = params.id;
      // const currentSpace = data.find((curr) => curr.name === space.name);
      console.log(data);
      console.log(space);
      let action = {
        type: "spaces",
        method: "put",
        data: {
          id: data.space.id,
          name: data.space.name,
          roomId: roomId,
          pictures: space.pictures,
          standard: raw5s.standard,
          assessedDate: null,
          viewedDate: null,
        },
      };
      useEntry(action);
      setSpace((prev) => ({
        ...prev,
        standard: raw5s.standard,
        isAssess: false,
      }));
    }
  }, [data, params.id, rooms, space, useEntry]);

  const handleScoreClick = useCallback((type) => {
    setSpace((prev) => ({
      ...prev,
      selectedScore: type,
    }));
  }, []);

  const handleImageClose = useCallback(() => {
    forSTDRef.current.checked = false;
  }, []);

  function handleResultSelect(selectedDate) {
    setSpace((prev) => {
      const foundRating = space?.rating.find(
        (r) => r.dateModified === selectedDate
      );
      return {
        ...prev,
        selectedRating: foundRating,
      };
    });
  }

  function handleSpaceCheck() {
    let action = {
      type: "spaces",
      method: "viewed",
      data: {
        id: data.space.id,
      },
    };
    useEntry(action);
  }

  const renderImageUploadModal = space.id && (
    <Modal
      buttonVariant="blue"
      buttonCaption="Submit"
      input={
        <>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
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
  );

  const renderImageDeleteModal = space.selectedImage && (
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
  );

  const isAssessedThisMonth =
    data.space.assessedDate &&
    new Date(data.space.assessedDate).getMonth() === new Date().getMonth();

  const renderAdminView =
    loggedIn.role === "admin" ||
    (loggedIn.role === "user" && isAssessedThisMonth) ? (
      <div className="relative flex bg-white md:w-full sm:w-[42rem] gap-8 shadow-sm p-8 pt-20  rounded-lg">
        <div className="flex  w-full absolute top-5  ">
          <Select
            onValueChange={(selectedDate) => handleResultSelect(selectedDate)}
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
              space.isLoad || space.isAssess ? 0 : space.selectedRating?.sort
            }
            onClick={() => {
              if (space.selectedScore !== "sort") handleScoreClick("sort");
            }}
          />
          <ScoreCard
            isLoad={space.isAssess}
            type="set"
            score={
              space.isLoad || space.isAssess
                ? 0
                : space.selectedRating?.setInOrder
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
              space.isLoad || space.isAssess ? 0 : space.selectedRating?.shine
            }
            onClick={() => {
              if (space.selectedScore !== "shine") handleScoreClick("shine");
            }}
          />
        </div>
        <Comment
          isLoad={space.isAssess || space.isLoad}
          selected={space.selectedScore}
          ratingId={space.selectedRating?.id}
        />
      </div>
    ) : null;

  return (
    <>
      {space.pictures === undefined ? (
        <div className=" w-32 h-fit text-center m-auto pt-2 mt-16">
          <p className="text-neutral-600 animate-bounce">Please wait...</p>
        </div>
      ) : (
        <>
          {renderImageUploadModal}
          {renderImageDeleteModal}
          {space.isAssess && space && (
            <div className=" w-32 h-fit text-center m-auto pt-2 mt-6">
              <p className="text-neutral-600 animate-bounce">Please wait...</p>
            </div>
          )}
          <div className="flex flex-col gap-4 md:p-6 sm:p-0 md:w-[90rem] sm:w-[44rem] mx-auto">
            <div className="flex flex-col bg-white md:w-full sm:w-[40rem] gap-8 shadow-sm py-8 md:px-16 sm:px-8 rounded-lg">
              <div className="flex justify-between">
                <div className="flex items-center gap-4 text-neutral-600 text-2xl">
                  <h2 className="uppercase">
                    {space.name ? space.name : "Space"}
                  </h2>
                  {space.name ? (
                    <p
                      className={`text-xs ${
                        space.standard !== ""
                          ? "bg-green-400"
                          : "bg-neutral-400"
                      } py-2 px-4 rounded-2xl text-white font-semibold opacity-60`}
                    >
                      {space.standard !== "" ? "Calibrated" : "Not Calibrated"}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                {loggedIn.role === "admin" && (
                  <Button variant="blue" onClick={handleSpaceCheck}>
                    Check
                  </Button>
                )}
              </div>
            </div>

            <div className="flex md:flex-row sm:flex-col bg-white md:w-full sm:w-[42rem] gap-8 shadow-sm p-8 rounded-lg">
              <div className="flex flex-col justify-between md:w-2/3">
                <ImageDisplay
                  onDelete={() => showModal("delete")}
                  selectedImage={space.selectedImage}
                />
                <div className="flex justify-between sm:justify-end">
                  <menu className="flex gap-4 sm:pt-8 justify-end">
                    {loggedIn.role !== "admin" && (
                      <>
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

            {renderAdminView}
          </div>
        </>
      )}
    </>
  );
}
