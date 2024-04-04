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
  addUser: () => {},
  addBuilding: () => {},
  addRoom: () => {},
  addSpace: () => {},
  addSpaceImage: () => {},
  addRating: () => {},
  addComment: () => {},
  addRedTag: () => {},
});

export default function DataContextProvider({ children }) {
  const [data, setData] = useState({
    users: undefined,
    buildings: undefined,
    rooms: undefined,
    spaces: undefined,
  });

  async function fetchAllData() {
    try {
      const newData = {
        users: [],
        buildings: [],
        rooms: [],
        spaces: [],
      };
      newData.users = (
        await axios.get(
          "https://fs-backend-copy-production.up.railway.app/api/user"
        )
      ).data;
      newData.buildings = (
        await axios.get(
          "https://fs-backend-copy-production.up.railway.app/api/buildings"
        )
      ).data;
      newData.rooms = (
        await axios.get(
          "https://fs-backend-copy-production.up.railway.app/api/rooms"
        )
      ).data;
      newData.spaces = (
        await axios.get(
          "https://fs-backend-copy-production.up.railway.app/api/space"
        )
      ).data;
      console.log(newData);
      setData(newData);
    } catch (error) {
      console.log(error);
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
  };
  return (
    <DataContext.Provider value={dataCtx}>{children}</DataContext.Provider>
  );
}
