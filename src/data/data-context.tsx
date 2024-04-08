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
        const spaceImages = (
          await axios.get(`${endpoint}/api/spaceImage/get/${action.data.id}`)
        ).data;
        console.log(spaceImages);
        setData((prev) => {
          return {
            ...prev,
            spaceImages,
          };
        });
      }
      if (action.method === "post") {
        const image = action.data.file;
        const formData = new FormData();
        formData.append("file", image);
        const spaceImages = (
          await axios.post(
            `${endpoint}/api/spaceImage/upload/${action.data.id}`,
            formData
          )
        ).data;
        console.log(spaceImages);
      }
    }
    // if (action.type === "ratings") {
    //   if (action.method === "get") {

    //     console.log(ratings);

    //     setData((prev) => {
    //       return {
    //         ...prev,
    //         ratings: latestRating,
    //       };
    //     });
    //   }
    // }
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
