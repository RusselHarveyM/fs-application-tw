import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const DataContext = createContext({
  users: undefined,
  buildings: undefined,
  rooms: undefined,
  spaces: undefined,
  spaceImages: undefined,
  ratings: undefined,
  comments: undefined,
  redTags: undefined,
  useEntry: () => {},
});

const endpoint = "https://fs-backend-copy-production.up.railway.app";

export default function DataContextProvider({ children }) {
  const [data, setData] = useState({
    users: undefined,
    buildings: undefined,
    rooms: undefined,
    spaces: undefined,
    spaceImages: undefined,
    ratings: undefined,
    comments: undefined,
  });

  async function fetchAllData() {
    try {
      const newData = {
        users: [],
        buildings: [],
        rooms: [],
        spaces: [],
        ratings: [],
        comments: [],
      };
      newData.users = (await axios.get(`${endpoint}/api/user`)).data;
      newData.buildings = (await axios.get(`${endpoint}/api/buildings`)).data;
      newData.rooms = (await axios.get(`${endpoint}/api/rooms`)).data;
      newData.spaces = (await axios.get(`${endpoint}/api/space`)).data;
      newData.ratings = (await axios.get(`${endpoint}/api/ratings`)).data;
      newData.comments = (await axios.get(`${endpoint}/api/comment`)).data;
      console.log(newData);
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  }

  async function getSpaceImagesBySpaceId(id) {
    try {
      const spaceImages = (
        await axios.get(`${endpoint}/api/spaceImage/get/${id}`)
      ).data;
      console.log("space images {} ", spaceImages);
      setData((prev) => {
        return {
          ...prev,
          spaceImages,
        };
      });
    } catch (error) {
      console.log(error);
      setData((prev) => {
        return {
          ...prev,
          spaceImages: [],
        };
      });
    }
  }

  async function addSpaceImage(image, id) {
    const formData = new FormData();
    formData.append("file", image);
    await axios.post(`${endpoint}/api/spaceImage/upload/${id}`, formData);
  }

  async function deleteSpaceImage(id) {
    await axios.delete(`${endpoint}/api/spaceImage/delete/${id}`);
  }

  /*
  ------------------------
  function handleUseEntry
  ------------------------
    param: action = {
        type: buildings/users/rooms/..
        method: GET/POST/..
        data: {} // if necessary
    }  
  */
  async function handleUseEntry(action) {
    //..
    if (action.type === "spaceimages") {
      if (action.method === "get") {
        await getSpaceImagesBySpaceId(action.data.id);
      }
      if (action.method === "post") {
        const image = action.data.file;
        await addSpaceImage(image, action.data.id);
        await getSpaceImagesBySpaceId(action.data.id);
      }
      if (action.method === "delete") {
        await deleteSpaceImage(action.data.imageId);
        await getSpaceImagesBySpaceId(action.data.spaceId);
        console.log("deleted");
      }
    }
    if (action.type === "ratings") {
      if (action.method === "get") {
        const ratings = (await axios.get(`${endpoint}/api/ratings`)).data;
        console.log(ratings);

        setData((prev) => {
          return {
            ...prev,
            ratings,
          };
        });
      }
      if (action.method === "post") {
        let scores = action.data.scores;
        console.log("scores", scores);
        const newRate = {
          id: "",
          sort: scores.sort,
          setInOrder: scores.setInOrder,
          shine: scores.shine,
          standarize: 0,
          sustain: 0,
          security: 0,
          isActive: true,
          spaceId: scores.spaceId,
        };
        const rating = (await axios.post(`${endpoint}/api/ratings`, newRate))
          .data;
        console.log(rating);
        const newComment = {
          id: "",
          sort: scores.comment.sort,
          setInOrder: scores.comment.setInOrder,
          shine: scores.comment.shine,
          standarize: "",
          sustain: "",
          security: "",
          isActive: true,
          ratingId: rating,
        };
        await axios.post(`${endpoint}/api/comment`, newComment);
        const comments = (await axios.get(`${endpoint}/api/comment`)).data;
        const ratings = (await axios.get(`${endpoint}/api/ratings`)).data;
        console.log(ratings);
        console.log(comments);

        setData((prev) => {
          return {
            ...prev,
            comments,
            ratings,
          };
        });
      }
    }
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  const dataCtx = {
    users: data.users,
    buildings: data.buildings,
    rooms: data.rooms,
    spaces: data.spaces,
    spaceImages: data.spaceImages,
    ratings: data.ratings,
    comments: data.comments,
    useEntry: handleUseEntry,
  };
  return (
    <DataContext.Provider value={dataCtx}>{children}</DataContext.Provider>
  );
}
