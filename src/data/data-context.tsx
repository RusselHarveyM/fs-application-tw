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
  });

  async function fetchAllData() {
    try {
      const newData = {
        users: [],
        buildings: [],
        rooms: [],
        spaces: [],
        ratings: [],
      };
      newData.users = (await axios.get(`${endpoint}/api/user`)).data;
      newData.buildings = (await axios.get(`${endpoint}/api/buildings`)).data;
      newData.rooms = (await axios.get(`${endpoint}/api/rooms`)).data;
      newData.spaces = (await axios.get(`${endpoint}/api/space`)).data;
      newData.ratings = (await axios.get(`${endpoint}/api/ratings`)).data;
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
      console.log(spaceImages);
      setData((prev) => {
        return {
          ...prev,
          spaceImages,
        };
      });
    } catch (error) {
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
        getSpaceImagesBySpaceId(action.data.id);
      }
      if (action.method === "post") {
        const image = action.data.file;
        addSpaceImage(image, action.data.id);
        getSpaceImagesBySpaceId(action.data.id);
      }
      if (action.method === "delete") {
        deleteSpaceImage(action.data.id);
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
        const rating = (
          await axios.post(`${endpoint}/api/ratings`, action.data.rate)
        ).data;
        console.log(rating);
        const ratings = (await axios.get(`${endpoint}/api/ratings`)).data;
        console.log(ratings);

        setData((prev) => {
          return {
            ...prev,
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
    useEntry: handleUseEntry,
  };
  return (
    <DataContext.Provider value={dataCtx}>{children}</DataContext.Provider>
  );
}
