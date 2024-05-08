import ImageGallery from "./ImageGallery";
import Button from "./Button";
import { useState, useContext, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";

import { DataContext } from "@/data/data-context";
import Modal from "./Modal";
import { Input } from "./ui/input";
import ImageDisplay from "./ImageDisplay";

import evaluate from "../helper/evaluate";
import comment from "../helper/comment";

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

import { checkMonth, getDateString } from "@/helper/date.js";
import { isEmpty } from "@/helper/string.js";
import Result from "./Result";
import { isAdminLoggedIn } from "@/helper/auth";

// const SPACE_DEFINITION = {
//   id: undefined,
//   name: "",
//   pictures: undefined,
//   roomId: undefined,
//   selectedImage: "",
//   standard: "",
//   selectedScore: "",
//   rating: [],
//   assessmentDuration: 0,
//   isLoad: false,
//   isUpload: false,
//   isAssess: false,
//   selectedRating: undefined,
// };

export default function Space({ data, ratings, spaceId }) {
  const { rooms, spaceImages, useEntry } = useContext(DataContext);
  // const [spaceImages, setSpaceImages] = useState(images);
  const { toast } = useToast();
  const params = useParams();
  const uploadModal = useRef();
  const forSTDRef = useRef();
  const selectedUploadImages = useRef();
  const deleteModal = useRef();
  const timer = useRef<NodeJS.Timeout | undefined>();
  const duration = useRef();
  // const [space, setSpace] = useState(SPACE_DEFINITION);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [selectedScore, setSelectedScore] = useState(undefined);
  const [selectedRating, setSelectedRating] = useState(undefined);
  const [isLoad, setIsLoad] = useState(false);

  const images = spaceImages?.filter((curr) => curr.spaceId === spaceId);

  // const [selectedRating, setSelectedRating] = useState(undefined);

  const loggedIn = isAdminLoggedIn();

  useEffect(() => {
    setIsLoad(false);
  }, [spaceImages]);

  console.log("space data >>> ", data);
  useEffect(() => {
    let action = {
      type: "spaceimages",
      method: "getById",
      data: {
        id: spaceId,
      },
    };
    setIsLoad(true);
    useEntry(action);
  }, [spaceId]);

  useEffect(() => {
    setSelectedRating(ratings && ratings[0]);
  }, [ratings]);

  // useEffect(() => {
  //   if (data) {
  //     setSpace((prev) => ({
  //       ...prev,
  //       ...data.space,
  //       rating: [...(data?.rating ?? [])],
  //     }));
  //   }
  // }, [data]);

  // useEffect(() => {
  //   let prevTimer = timer.current;
  //   if (timer.current) {
  //     timer.current = undefined;
  //     clearInterval(timer.current);
  //     toast({
  //       title: "Task is Complete",
  //       variant: "success",
  //       description: "Assessment Task is complete!",
  //       action: <ToastAction altText="dismiss">Dismiss</ToastAction>,
  //     });
  //   }
  //   if (space.selectedImage === undefined) {
  //     toast({
  //       title: "Image Deleted",
  //       variant: "destructive",
  //       action: <ToastAction altText="dismiss">Dismiss</ToastAction>,
  //     });
  //   }
  //   if (space.isUpload) {
  //     toast({
  //       title: "Task is Complete",
  //       variant: "success",
  //       description: "Upload Task is complete!",
  //       action: <ToastAction altText="dismiss">Dismiss</ToastAction>,
  //     });
  //   }
  //   setSpace((prev) => {
  //     console.log(data?.rating);
  //     return {
  //       ...prev,
  //       pictures: data?.space?.pictures ?? [],
  //       rating: [...(data?.rating ?? [])],
  //       isLoad: prev.pictures !== undefined && false,
  //       selectedRating: data?.rating && data?.rating[0],
  //       isUpload: false,
  //       isAssess: false,
  //       selectedImage: "",
  //       selectedScore: "",
  //       assessmentDuration: prevTimer ? duration.current : 0,
  //     };
  //   });
  // }, [data]);

  const handleImageSelect = useCallback((image) => {
    setSelectedImage(image);
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
          spaceId: data?.id,
          forType: type,
          prediction: "",
          file: selectedUploadImages.current,
        },
      };
      useEntry(action);
    },
    [useEntry]
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
        imageId: selectedImage?.id,
        spaceId: data.id,
      },
    };
    useEntry(action);
    selectedImage(undefined);
  }, []);

  const handleAssessBtn = useCallback(async (isCalibrate: boolean) => {
    if (!data) return;
    setIsLoad(true);
    const newImages = images?.map((imageObject) => ({
      image: "data:image/png;base64," + imageObject.image,
      forType: imageObject.forType,
    }));

    duration.current = 0;
    timer.current = setInterval(() => {
      duration.current += 1;
    }, 1000);

    console.log("before evaluate >>> ", data);

    const raw5s = await evaluate(
      newImages,
      data?.name,
      data?.standard,
      isCalibrate
    );

    console.log("raw5s  >>> ", raw5s);

    if (raw5s) {
      const { sort, set, shine } = comment(raw5s);
      const { score: sortScore } = raw5s.scores.sort;
      const { score: setScore } = raw5s.scores.set;
      const { score: shineScore } = raw5s.scores.shine;

      const sortScoreFixed = parseFloat(sortScore.toFixed(1));
      const setScoreFixed = parseFloat(setScore.toFixed(1));
      const shineScoreFixed = parseFloat(shineScore.toFixed(1));

      const totalScore = ratings?.reduce(
        (acc, score) => acc + (score.sort + score.setInOrder + score.shine) / 3,
        0
      );

      let averageScore = totalScore / ratings?.length;
      averageScore = Math.min(Math.max(averageScore, 1), 10);

      let scores = {
        spaceId: data?.id,
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

      let newPictures = [];
      let pictureActions = [];

      for (let i = 0; i < newImages.length; i++) {
        newPictures.push({
          image: newImages[i].image,
          prediction: raw5s.predictions[i],
          forType: newImages[i].forType,
        });

        pictureActions.push({
          type: "spaceimages",
          method: "put",
          data: {
            id: data?.space?.pictures[i].id,
            spaceId: images[0].spaceId,
            image: newPictures[i].image,
            forType: newPictures[i].forType,
            prediction: JSON.stringify(raw5s.predictions[i]),
          },
        });
      }

      useEntry(pictureActions);
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
        method: "put",
        data: {
          name: data?.name,
          standard: isCalibrate ? raw5s.standard : data?.standard,
        },
      };

      useEntry(newAction);

      if (isCalibrate) {
        newAction = {
          type: "spaces",
          method: "calibrate",
          data: {
            id: data.id,
          },
        };

        useEntry(newAction);
      } else {
        newAction = {
          type: "spaces",
          method: "assessed",
          data: {
            id: data.id,
          },
        };

        useEntry(newAction);
      }
      setIsLoad(false);
    }
  }, []);

  const handleScoreClick = useCallback((type) => {
    setSelectedScore(type);
  }, []);

  const handleImageClose = useCallback(() => {
    forSTDRef.current.checked = false;
  }, []);

  function handleResultSelect(selectedDate) {
    const foundRating = ratings.find((r) => r.dateModified === selectedDate);
    setSelectedRating(foundRating);
  }

  function handleSpaceCheck() {
    let action = {
      type: "spaces",
      method: "viewed",
      data: {
        id: data.id,
      },
    };
    useEntry(action);
  }

  const renderImageUploadModal = (
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

  const renderImageDeleteModal = selectedImage && (
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
  console.log("selectedRating >>", selectedRating);
  const renderAdminView =
    loggedIn || (!loggedIn && checkMonth(data?.assessedDate)) ? (
      <Result
        data={data}
        ratings={ratings}
        isLoading={isLoad}
        handleResultSelect={handleResultSelect}
        handleScoreClick={handleScoreClick}
        selectedRating={selectedRating}
        selectedScore={selectedScore}
      />
    ) : null;

  return (
    <>
      {isLoad && (
        <div className=" w-32 h-fit text-center m-auto pt-2 mt-16">
          <p className="text-neutral-600 animate-bounce">Fetching data...</p>
        </div>
      )}
      {renderImageUploadModal}
      {renderImageDeleteModal}
      <div className="flex flex-col gap-4 md:p-6 sm:p-0 md:w-[90rem] sm:w-[44rem] mx-auto">
        <div className="flex flex-col bg-white md:w-full sm:w-[40rem] gap-8 shadow-sm py-8 md:px-16 sm:px-8 rounded-lg">
          <div className="flex justify-between">
            <div className="flex items-center gap-4 text-neutral-600 text-2xl">
              <h2 className="uppercase">{data.name ? data.name : "Space"}</h2>
              {data.name ? (
                <p
                  className={`text-xs ${
                    checkMonth(data?.calibrationDate)
                      ? "bg-green-400"
                      : "bg-neutral-400"
                  } py-2 px-4 rounded-2xl text-white font-semibold opacity-60`}
                >
                  {checkMonth(data?.calibrationDate)
                    ? "Calibrated"
                    : "Not Calibrated"}
                </p>
              ) : (
                ""
              )}
              <p className="text-xs text-neutral-500">
                {getDateString(data?.calibrationDate)}
              </p>
            </div>
            {loggedIn && (
              <Button
                variant="blue"
                onClick={handleSpaceCheck}
                disabled={
                  isLoad ||
                  (data.viewedDate === null && data.assessedDate === null)
                    ? true
                    : checkMonth(data.assessedDate) === true &&
                      checkMonth(data.viewedDate) === false
                    ? false
                    : true
                }
              >
                Check
              </Button>
            )}
          </div>
        </div>

        <div className="flex md:flex-row sm:flex-col bg-white md:w-full sm:w-[42rem] gap-8 shadow-sm p-8 rounded-lg">
          <div className="flex flex-col justify-between md:w-2/3">
            <ImageDisplay
              onDelete={() => showModal("delete")}
              selectedImage={selectedImage}
            />
            <div className="flex justify-between sm:justify-end">
              <div className="flex gap-4 sm:pt-8 justify-end w-full">
                {!loggedIn && (
                  <div className="flex justify-between w-full">
                    <menu>
                      <Button
                        variant="blue"
                        onClick={() => showModal("upload")}
                        disabled={isLoad}
                      >
                        Upload
                      </Button>
                    </menu>
                    <menu className=" flex gap-5">
                      <Button
                        onClick={() => handleAssessBtn(true)}
                        disabled={isLoad}
                      >
                        Calibrate
                      </Button>
                      <Button
                        variant="blue"
                        onClick={() => handleAssessBtn(false)}
                        disabled={isLoad}
                      >
                        Assess
                      </Button>
                    </menu>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ImageGallery
            isLoad={isLoad}
            images={images}
            onSelectImage={handleImageSelect}
          />
        </div>

        {renderAdminView}
      </div>
    </>
  );
}
