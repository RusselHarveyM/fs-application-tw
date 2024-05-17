import ImageGallery from "./ImageGallery";
import Button from "./Button";
import { useState, useContext, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { DataContext } from "@/data/data-context";
import Modal from "./Modal";
import { Input } from "./ui/input";
import ImageDisplay from "./ImageDisplay";

import evaluate from "../helper/evaluate";
import comment from "../helper/comment";

import {
  checkMonth,
  getDateNow,
  calculateMonthlyAverages,
} from "@/helper/date.js";
import Result from "./Result";
import { isAdminLoggedIn, getAuthToken } from "@/helper/auth";
import { Circle } from "rc-progress";
import SpaceHeading from "./SpaceHeading";

export default function Space({
  data,
  dataByRoom,
  ratings,
  spaceId,
  onStore,
  onLoad,
  loaded,
  onDelete,
}) {
  const { rooms, spaceImages, useEntry } = useContext(DataContext);
  const navigate = useNavigate();
  const params = useParams();
  const uploadModal = useRef();
  const forSTDRef = useRef();
  const selectedUploadImages = useRef();
  const deleteModal = useRef();
  const timer = useRef<NodeJS.Timeout | undefined>();
  const duration = useRef();
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [selectedScore, setSelectedScore] = useState(undefined);
  const [selectedRating, setSelectedRating] = useState(ratings && ratings[0]);
  const [isFetch, setIsFetch] = useState<Boolean>(false);
  const [isEvaluate, setIsEvaluate] = useState<Boolean>(false);

  const spaceImageData = loaded?.find((curr) => curr.id === spaceId);
  const images = spaceImageData?.images;

  const loggedIn = isAdminLoggedIn();

  function getSpaceImages() {
    let action = {
      type: "spaceimages",
      method: "getById",
      data: {
        id: spaceId,
      },
    };
    useEntry(action);
  }

  useEffect(() => {
    setIsFetch(false);
    console.log("spaceImages [][]", spaceImages);
    if (spaceImages || spaceImages?.length === 0) {
      onStore(spaceId, spaceImages);
      // setPrevSpaceId(undefined);getSpaceImages();
    }
  }, [spaceImages]);

  useEffect(() => {
    console.log("??spaceImageData ", spaceImageData);
    if (!spaceImageData || spaceImageData.length === 0) {
      // setLoadingCaption("Fetching data...");
      getSpaceImages();
      setIsFetch(true);
    }
    setSelectedImage(undefined);
  }, [spaceId]);

  useEffect(() => {
    if (ratings) {
      setSelectedRating(ratings[0]);
    }
  }, [spaceId]);

  const handleImageSelect = useCallback((image) => {
    console.log("image >> ", image);
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
      setIsFetch(true);
      let type = forSTDRef.current.checked ? forSTDRef.current.value : "all";
      forSTDRef.current.checked = false;

      uploadModal.current.close();
      let action = {
        type: "spaceimages",
        method: "post",
        data: {
          spaceId: spaceId,
          forType: type,
          prediction: "",
          file: selectedUploadImages.current,
        },
      };
      useEntry(action);
      onLoad(true);
    },
    [spaceId, selectedImage]
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
    console.log("selectedImage >> ", selectedImage);
    let action = {
      type: "spaceimages",
      method: "delete",
      data: {
        imageId: selectedImage?.id,
        spaceId,
      },
    };
    useEntry(action);
    onDelete(spaceId, selectedImage?.id);
    // getSpaceImages();
    setSelectedImage(undefined);
  }, [spaceId, selectedImage]);

  const handleAssessBtn = useCallback(
    async (isCalibrate: boolean) => {
      const authToken = getAuthToken();
      if (!authToken) {
        navigate("/");
      }
      if (!data) return;

      setIsEvaluate(true);
      onLoad(true);
      // setLoadingCaption(isCalibrate ? "Calibrating..." : "Assessing...");
      const newImages = images?.map((imageObject) => ({
        image: "data:image/png;base64," + imageObject.image,
        forType: imageObject.forType,
      }));

      duration.current = 0;
      timer.current = setInterval(() => {
        duration.current += 1;
      }, 1000);

      console.log("before evaluate >>> ", data);

      console.log("newImages >> ", images);

      const raw5s = await evaluate(newImages, data?.standard, isCalibrate);

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
          (acc, score) =>
            acc + (score.sort + score.setInOrder + score.shine) / 3,
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

        if (!isCalibrate) {
          let action = {
            type: "ratings",
            method: "post",
            data: {
              scores,
            },
          };
          useEntry(action);
        }

        let updatedImages = [];

        for (let i = 0; i < newImages.length; i++) {
          const data = {
            id: images[i].id,
            spaceId: images[i].spaceId,
            image: images[i].image,
            forType: images[i].forType,
            prediction: JSON.stringify(raw5s.predictions[i]),
          };
          updatedImages.push(data);
        }

        let pictureData = {
          type: "spaceimages",
          method: "puts",
          data: {
            spaceId: updatedImages[0].spaceId,
            spaceImages: updatedImages,
          },
        };

        useEntry(pictureData);

        const roomId = params.id;
        const foundRoom = rooms.find((obj) => obj.id === roomId);

        const roomData = [...dataByRoom.data];

        roomData.push({
          ratings: [
            {
              dateModified: getDateNow(),
              spaceId: data?.id,
              sort: sortScoreFixed,
              setInOrder: setScoreFixed,
              shine: shineScoreFixed,
            },
          ],
        });

        const roomDataResult = calculateMonthlyAverages(roomData);
        const currentMonth = roomDataResult[roomDataResult.length - 1];

        let status =
          currentMonth.Average < 4
            ? "critical"
            : currentMonth.Average < 8
            ? "warning"
            : "healthy";

        console.log("currentMonth 0000 ", currentMonth);
        console.log("status 0000 ", status);

        console.log("authToken >> ", authToken);
        let newAction = {
          type: "rooms",
          method: "put",
          data: {
            id: roomId,
            buildingId: foundRoom.buildingId,
            roomNumber: foundRoom.roomNumber,
            image: foundRoom.image,
            status: status,
            modifiedBy: [authToken.id, ...foundRoom.modifiedBy],
          },
        };

        useEntry(newAction);

        if (isCalibrate) {
          console.log("calibrating");
          newAction = {
            type: "spaces",
            method: "put",
            data: {
              id: spaceId,
              roomId: data?.roomId,
              name: data?.name,
              standard: raw5s.standard,
              calibrationDate: getDateNow(),
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
        setIsEvaluate(false);
        onLoad(false);
      }
    },
    [images]
  );

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
      buttonVariant="rose"
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
      <h2 className="text-white text-xl mb-4 p-4 bg-rose-500">
        Upload an Image
      </h2>
    </Modal>
  );

  const renderImageDeleteModal = selectedImage && (
    <Modal
      ref={deleteModal}
      buttonCaption="Delete"
      buttonVariant="red"
      onSubmit={handleImageDelete}
    >
      <h2 className="text-white text-xl mb-4 p-4 bg-rose-500">
        Are you sure you want to delete this image?
      </h2>
    </Modal>
  );
  console.log("ratings  ratings>>", ratings);
  const renderAdminView =
    loggedIn || (!loggedIn && checkMonth(data?.viewedDate)) ? (
      ratings.length > 0 ? (
        <Result
          // data={data}
          ratings={ratings}
          // isLoading={isLoad}
          handleResultSelect={handleResultSelect}
          handleScoreClick={handleScoreClick}
          selectedRating={selectedRating}
          selectedScore={selectedScore}
        />
      ) : (
        <p className="text-neutral-500 mx-auto">No Ratings yet...</p>
      )
    ) : null;

  return (
    <>
      {isFetch && (
        <div className="absolute bottom-14 z-50 right-14">
          <Circle
            percent={50}
            trailWidth={18}
            strokeWidth={18}
            strokeLinecap="butt"
            trailColor={"#fff"}
            strokeColor={"#000"}
            className="animate-spin absolute w-7 h-7 left-1 top-1"
          />
        </div>
      )}

      {renderImageUploadModal}
      {renderImageDeleteModal}
      <div className="flex flex-col gap-4 md:w-[90rem] sm:w-[44rem] xs:w-[22rem] mx-auto bg-white rounded-lg mt-10 mb-20">
        <SpaceHeading
          name={data?.name}
          calibrationDate={data?.calibrationDate}
          viewedDate={data?.viewedDate}
          assessedDate={data?.assessedDate}
          onSpaceCheck={handleSpaceCheck}
          isLoad={isFetch || isEvaluate}
          standard={data?.standard}
        />

        <div className="flex md:flex-row sm:flex-col xs:flex-col bg-white md:w-full  sm:w-[44rem] xs:mb-10 gap-8 shadow p-8 rounded-lg">
          <div className="flex flex-col justify-between md:w-2/3">
            <ImageDisplay
              isLoad={isEvaluate}
              onDelete={() => showModal("delete")}
              selectedImage={selectedImage}
            />
            <div className="flex justify-between sm:justify-end xs:justify-end sm:mt-0 xs:mt-1">
              <div className="flex gap-4 sm:pt-8 justify-end w-full">
                {!loggedIn && (
                  <div className="flex justify-between w-full">
                    <menu>
                      <Button
                        variant="rose"
                        onClick={() => showModal("upload")}
                        disabled={isFetch || isEvaluate}
                      >
                        Upload
                      </Button>
                    </menu>
                    <menu className=" flex gap-5">
                      <Button
                        onClick={() => handleAssessBtn(true)}
                        disabled={isFetch || isEvaluate || !images}
                      >
                        Calibrate
                      </Button>
                      <Button
                        variant="rose"
                        onClick={() => handleAssessBtn(false)}
                        disabled={
                          isFetch ||
                          isEvaluate ||
                          // !checkMonth(data.calibrationDate) ||
                          // checkMonth(data.assessedDate) ||
                          !images
                        }
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
            isLoad={isEvaluate || isFetch}
            images={images}
            onSelectImage={handleImageSelect}
          />
        </div>
        {renderAdminView}
      </div>
    </>
  );
}
