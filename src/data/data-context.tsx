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
      newData.users = (await axios.get(`${endpoint}/api/user`)).data.map(user => ({
        ...user,
        Name: `${user.firstName} ${user.lastName}` // Calculate fullname
      }));
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

  async function deleteUser(userId) {
    await axios.delete(`${endpoint}/api/user/${userId}`);
  }

  async function deleteBuilding(buildingName) {
    await axios.delete(`${endpoint}/api/buildings/${buildingName}`);
  }

  async function deleteRoom(roomNumber, buildingId) {
    await axios.delete(`${endpoint}/api/rooms/${buildingId}?roomNumber=${roomNumber}`);
  }

  async function deleteSpace(spaceId) {
    await axios.delete(`${endpoint}/api/space/${spaceId}`);
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
        await deleteSpaceImage(action.data.id);
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
    if (action.type === 'users') {
      if (action.method === 'delete') {
        const userId = action.data.id;
        // Perform the deletion logic here, such as making a DELETE request to your backend API
        try {
          // Assuming your API endpoint for deleting a user is `${endpoint}/api/user/${userId}`
          await deleteUser(userId);
          // After successful deletion, update the users data in state
          setData((prevData) => ({
            ...prevData,
            users: prevData.users.filter(user => user.id !== userId)
          }));
          console.log(`User with ID ${userId} deleted successfully`);
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      }
    }
    if (action.type === 'buildings') {
      if (action.method === 'delete') {
        const buildingName = action.data.buildingName;
        console.log(buildingName);
        // Perform the deletion logic here, such as making a DELETE request to your backend API
        try {
          // Assuming your API endpoint for deleting a building is `${endpoint}/api/buildings/${buildingName}`
          await deleteBuilding(buildingName);
          // After successful deletion, update the building data in state
          setData((prevData) => ({
            ...prevData,
            buildings: prevData.buildings.filter(building => building.buildingName !== buildingName)
          }));
          console.log(`Building with Name ${buildingName} deleted successfully`);
        } catch (error) {
          console.error('Error deleting Building:', error);
        }
      }
    }
    if (action.type === 'rooms') {
      if (action.method === 'delete') {
        const { roomNumber, buildingId } = action.data;
        console.log(roomNumber, buildingId);
        // Perform the deletion logic here, such as making a DELETE request to your backend API
        try {
          // Assuming your API endpoint for deleting a room is `${endpoint}/api/rooms/${roomNumber}`
          await deleteRoom(roomNumber, buildingId);
          // After successful deletion, update the room data in state
          setData((prevData) => ({
            ...prevData,
            rooms: prevData.rooms.filter(room => room.roomNumber !== roomNumber)
          }));
          console.log(`Room with number ${roomNumber} in building ${buildingId} deleted successfully`);
        } catch (error) {
          console.error('Error deleting room:', error);
        }
      }
    }
    if (action.type === 'spaces') {
      if (action.method === 'delete') {
        const spaceId = action.data.id;
        console.log(spaceId);
        // Perform the deletion logic here, such as making a DELETE request to your backend API
        try {
          // Assuming your API endpoint for deleting a room is `${endpoint}/api/space/${spaceId}`
          await deleteSpace(spaceId);
          // After successful deletion, update the space data in state
          setData((prevData) => ({
            ...prevData,
            spaces: prevData.spaces.filter(space => space.id !== spaceId)
          }));
          console.log(`Space with ID ${spaceId} deleted successfully`);
        } catch (error) {
          console.error('Error deleting space:', error);
        }
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
