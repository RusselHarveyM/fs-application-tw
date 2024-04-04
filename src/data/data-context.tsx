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
  editEntry: () => {},
});

const endpoint = "https://fs-backend-copy-production.up.railway.app";

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
      newData.users = (await axios.get(`${endpoint}/api/user`)).data;
      newData.buildings = (await axios.get(`${endpoint}/api/buildings`)).data;
      newData.rooms = (await axios.get(`${endpoint}/api/rooms`)).data;
      newData.spaces = (await axios.get(`${endpoint}/api/space`)).data;
      console.log(newData);
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  }

  /*
  ------------------------
  function handleEditEntry
  ------------------------
    param: action = {
        type: buildings/users/rooms/..
        method: GET/POST/..
        data: {} // if necessary
    }  
  */
  function handleEditEntry(action) {
    //..
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
