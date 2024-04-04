import { createContext, useEffect, useReducer, useState } from "react";
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
  updateEntry: () => {},
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
    return newData;
  } catch (error) {
    console.log(error);
  }
}

export function dataReducer(state, action) {
  if (action.type === "ADD_ENTRY") {
    //..
  }
  if (action.type === "UPDATE_ENTRY") {
    //..
  }
  if (action.type === "DELETE_ENTRY") {
    //..
  }
  if (action.type === "READ_ENTRIES") {
    const data = fetchAllData();
    return { data };
  }

  return state;
}

export default function DataContextProvider({ children }) {
  const [data, dataDispatch] = useReducer(dataReducer, {
    users: undefined,
    buildings: undefined,
    rooms: undefined,
    spaces: undefined,
  });

  /*
  handleUpdateEntry
    action - object
    {
        type: ADD_ENTRY/UPDATE_ENTRY/..
        endpoint: https://..
        data: {} // if necessary.
    }
  */
  function handleUpdateEntry(action) {
    dataDispatch({
      type: action.type,
      payload: {
        endpoint: action.endpoint,
        data: action.data ?? undefined,
      },
    });
  }

  useEffect(() => {
    dataDispatch({
      type: "READ_ENTRIES",
    });
  }, []);

  const dataCtx = {
    users: data.users,
    buildings: data.buildings,
    rooms: data.rooms,
    spaces: data.spaces,
    updateEntry: handleUpdateEntry,
  };
  return (
    <DataContext.Provider value={dataCtx}>{children}</DataContext.Provider>
  );
}
