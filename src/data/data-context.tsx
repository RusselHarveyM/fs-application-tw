import { createContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { ToastAction } from "@radix-ui/react-toast";

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

// const endpoint = "https://fs-backend-copy-production.up.railway.app";
const endpoint = "https://localhost:7124";

export default function DataContextProvider({ children }) {
  const { toast } = useToast();
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
    const newData = {
      users: [],
      buildings: [],
      rooms: [],
      spaces: [],
    };
    newData.users = (await axios.get(`${endpoint}/api/user`)).data.map(
      (user) => ({
        ...user,
        Name: `${user.firstName} ${user.lastName}`, // Calculate fullname
      })
    );
    try {
      const data = (await axios.get(`${endpoint}/api/buildings`)).data;
      newData.buildings = data === "" ? [] : data;
    } catch (error) {
      newData.buildings = [];
    }

    try {
      newData.rooms = (await axios.get(`${endpoint}/api/rooms`)).data;
    } catch (error) {
      newData.rooms = [];
    }

    try {
      newData.spaces = (await axios.get(`${endpoint}/api/space`)).data;
    } catch (error) {
      newData.spaces = [];
    }
    setData(newData);
  }

  function somethingWentWrong(message) {
    toast({
      title: "Something went wrong!",
      variant: "destructive",
      description: message,
      action: <ToastAction altText="dismiss">Dismiss</ToastAction>,
    });
  }

  function success(message) {
    toast({
      title: "Success",
      variant: "success",
      description: message,
      action: <ToastAction altText="dismiss">Dismiss</ToastAction>,
    });
  }

  async function getSpaceImagesById(id) {
    try {
      const spaceImages = (
        await axios.get(`${endpoint}/api/spaceImage/get/${id}`)
      ).data;
      // success("Fetched Data Successfully.");
      setData((prev) => {
        return {
          ...prev,
          spaceImages,
        };
      });
    } catch (error) {
      somethingWentWrong(
        "It looks like there's a problem fetching the Space Images."
      );
      setData((prev) => {
        return {
          ...prev,
          spaceImages: [],
        };
      });
    }
  }

  async function getSpaceImages() {
    try {
      const spaceImages = (
        await axios.get(`${endpoint}/api/spaceImage/get/spaces`)
      ).data;
      // success("Fetched Data Successfully.");
      setData((prev) => {
        return {
          ...prev,
          spaceImages,
        };
      });
    } catch (error) {
      somethingWentWrong(
        "It looks like there's a problem fetching the Space Images."
      );

      setData((prev) => {
        return {
          ...prev,
          spaceImages: [],
        };
      });
    }
  }

  async function getSpaceImagesBySpaceId(id) {
    try {
      const spaceImages = (
        await axios.get(`${endpoint}/api/spaceImage/get/${id}`)
      ).data;

      // success("Fetched Data Successfully.");
      setData((prev) => {
        return {
          ...prev,
          spaceImages,
        };
      });
    } catch (error) {
      somethingWentWrong(
        "It looks like there's a problem fetching the Space Images."
      );
      setData((prev) => {
        return {
          ...prev,
          spaceImages: [],
        };
      });
    }
  }

  async function addSpaceImage(data, id) {
    const formData = new FormData();
    formData.append("file", data.image);
    formData.append("forType", data.forType);

    await axios
      .post(`${endpoint}/api/spaceImage/upload/${id}`, formData)
      .then(() => {
        success("Added Space Image Successfully.");
      })
      .catch(() => {
        somethingWentWrong(
          "It looks like there's a problem adding the Space Image."
        );
      });
  }

  async function deleteSpaceImage(id) {
    await axios
      .delete(`${endpoint}/api/spaceImage/delete/${id}`)
      .then(() => {
        success("Deleted Space Image Successfully.");
      })
      .catch(() => {
        somethingWentWrong(
          "It looks like there's a problem deleting the Space Image."
        );
      });
  }

  async function addNewUser(userData) {
    try {
      // Make the POST request to add a new user
      await axios.post(`${endpoint}/api/user`, userData);
      success("Added new user successfully.");
    } catch (error) {
      somethingWentWrong("It looks like there's a problem adding a new user.");
      console.error("Error adding new user:", error);
    }
  }

  async function updateUser(userId, updatedUserData) {
    return axios
      .put(`${endpoint}/api/user/${userId}`, updatedUserData)
      .then(() => success(`Updated the user ${userId} successfully.`))
      .catch((error) =>
        somethingWentWrong("It looks like there's a problem updating the user.")
      );
  }

  async function deleteUser(userId) {
    await axios
      .delete(`${endpoint}/api/user/${userId}`)
      .then(() => {
        success(`Deleted the user ${userId} successfully.`);
      })
      .catch(() => {
        somethingWentWrong(
          "It looks like there's a problem deleting the user."
        );
      });
  }

  async function addBuilding(buildingData) {
    try {
      // Send a POST request to the API endpoint with the new building data
      const response = await axios.post(
        `${endpoint}/api/buildings`,
        buildingData
      );
      success(`Added a new building successfully.`);
      // Return the newly created building object from the response
      return response.data;
    } catch (error) {
      // Handle any errors that occur during the request
      somethingWentWrong(
        "It looks like there's a problem adding a new building."
      );
      console.error("Error adding building:", error);
      throw error; // Optional: rethrow the error to be handled elsewhere
    }
  }

  async function updateBuilding(buildingId, updatedBuildingData) {
    return axios
      .put(`${endpoint}/api/buildings/${buildingId}`, updatedBuildingData)
      .then(() => success(`Updated the building ${buildingId} successfully.`))
      .catch((error) =>
        somethingWentWrong(
          "It looks like there's a problem updating the building."
        )
      );
  }

  async function deleteBuilding(buildingName) {
    await axios
      .delete(`${endpoint}/api/buildings/${buildingName}`)
      .then(() => {
        success(`Deleted the building ${buildingName} successfully.`);
      })
      .catch(() => {
        somethingWentWrong(
          "It looks like there's a problem deleting the building."
        );
      });
  }

  //create room add and edit here
  async function addRoom(roomData) {
    try {
      // Send a POST request to the API endpoint with the new room data
      const response = await axios.post(`${endpoint}/api/rooms`, roomData);

      // Return the newly created room object from the response
      success(`Added a new room successfully.`);
      return response.data;
    } catch (error) {
      // Handle any errors that occur during the request
      somethingWentWrong("It looks like there's a problem adding a new room.");
      console.error("Error adding room:", error);
      throw error; // Optional: rethrow the error to be handled elsewhere
    }
  }

  async function updateRoom(roomId, updatedRoomData) {
    return axios
      .put(`${endpoint}/api/rooms/${roomId}`, updatedRoomData)
      .then(() => success(`Updated the room ${roomId} successfully.`))
      .catch((error) =>
        somethingWentWrong("It looks like there's a problem updating the room.")
      );
  }

  async function deleteRoom(roomNumber, buildingId) {
    await axios
      .delete(`${endpoint}/api/rooms/${buildingId}?roomNumber=${roomNumber}`)
      .then(() => {
        success(`Deleted the room ${roomNumber} successfully.`);
      })
      .catch(() => {
        somethingWentWrong(
          "It looks like there's a problem deleting the room."
        );
      });
  }

  async function addSpace(spaceData) {
    try {
      // Send a POST request to the API endpoint with the new room data
      const response = await axios.post(`${endpoint}/api/space`, spaceData);

      // Return the newly created room object from the response
      success(`Added a new space successfully.`);
      return response.data;
    } catch (error) {
      // Handle any errors that occur during the request
      somethingWentWrong("It looks like there's a problem adding a new space.");
      throw error; // Optional: rethrow the error to be handled elsewhere
    }
  }

  async function updateSpace(spaceId, updatedSpaceData) {
    console.log(updatedSpaceData);
    return axios
      .put(`${endpoint}/api/space/${spaceId}`, updatedSpaceData)
      .then(() => success(`Updated the space ${spaceId} successfully.`))
      .catch((error) =>
        somethingWentWrong(
          "It looks like there's a problem updating the space."
        )
      );
  }

  async function deleteSpace(spaceId) {
    await axios
      .delete(`${endpoint}/api/space/${spaceId}`)
      .then(() => {
        success(`Deleted the space ${spaceId} successfully.`);
      })
      .catch(() => {
        somethingWentWrong(
          "It looks like there's a problem deleting the space."
        );
      });
  }

  async function getSpaces() {
    try {
      const spaces = (await axios.get(`${endpoint}/api/space`)).data;

      setData((prev) => {
        return {
          ...prev,
          spaces,
        };
      });

      // success("Fetched Data Successfully.");
    } catch (error) {
      somethingWentWrong(
        "It looks like there's a problem fetching the space data."
      );
      setData((prev) => {
        return {
          ...prev,
          spaces: [],
        };
      });
    }
  }

  async function getRooms() {
    try {
      const rooms = (await axios.get(`${endpoint}/api/rooms`)).data;
      // success("Fetched Data Successfully.");
      setData((prev) => {
        return {
          ...prev,
          rooms,
        };
      });
    } catch (error) {
      somethingWentWrong(
        "It looks like there's a problem fetching the room data."
      );
      setData((prev) => {
        return {
          ...prev,
          rooms: [],
        };
      });
    }
  }

  async function getBuildings() {
    try {
      const buildings = (await axios.get(`${endpoint}/api/buildings`)).data;
      setData((prev) => {
        return {
          ...prev,
          buildings,
        };
      });
      // success("Fetched Data Successfully.");
    } catch (error) {
      somethingWentWrong(
        "It looks like there's a problem fetching the building data."
      );
      setData((prev) => {
        return {
          ...prev,
          buildings: [],
        };
      });
    }
  }

  async function updateSpaceImage(data) {
    return axios
      .put(`${endpoint}/api/spaceimage/${data.id}`, data)
      .then(() => success("Updated the space image successfully."))
      .catch((error) => {
        console.log(error);
        somethingWentWrong(
          "It looks like there's a problem updating the space image."
        );
      });
  }

  async function updateSpaceImages(data) {
    return axios
      .put(`${endpoint}/api/spaceimages/${data.id}`, data)
      .then(() => success("Updated the space images successfully."))
      .catch((error) => {
        console.log(error);
        somethingWentWrong(
          "It looks like there's a problem updating the space images."
        );
      });
  }

  async function updateSpaceViewedDate(id) {
    console.log("viewed date id", id);
    let result;
    await axios
      .put(`${endpoint}/api/space/${id}/vieweddate`)
      .then((data) => {
        result = data;
        success("Updated the space viewed date successfully.");
      })
      .catch(() =>
        somethingWentWrong(
          "It looks like there's a problem updating the space viewed date."
        )
      );
    return result;
  }

  async function updateSpaceAssessedDate(id) {
    let result;

    await axios
      .put(`${endpoint}/api/space/${id}/assesseddate`)
      .then((data) => {
        result = data;
        success("Updated the space assessed date successfully.");
      })
      .catch(() =>
        somethingWentWrong(
          "It looks like there's a problem updating the space assessed date."
        )
      );

    return result;
  }

  async function updateSpaceCalibrationDate(id) {
    let result;
    await axios
      .put(`${endpoint}/api/space/${id}/calibrationdate`)
      .then((data) => {
        result = data;
        success("Updated the space calibration date successfully.");
      })
      .catch(() =>
        somethingWentWrong(
          "It looks like there's a problem updating the space calibration date."
        )
      );
    return result;
  }

  async function getRatings() {
    try {
      const ratings = (await axios.get(`${endpoint}/api/ratings`)).data;
      // success("Fetched the data successfully.");
      setData((prev) => {
        return {
          ...prev,
          ratings,
        };
      });
    } catch (e) {
      somethingWentWrong(
        "It looks like there's a problem fetching the ratings data."
      );
      setData((prev) => {
        return {
          ...prev,
          ratings: [],
        };
      });
    }
  }

  async function getRatingsById(id) {
    try {
      const ratings = (await axios.get(`${endpoint}/api/ratings/${id}/ratings`))
        .data;
      setData((prev) => {
        return {
          ...prev,
          ratings,
        };
      });
    } catch (e) {
      somethingWentWrong(
        "It looks like there's a problem fetching the ratings data by id."
      );
      setData((prev) => {
        return {
          ...prev,
          ratings: [],
        };
      });
    }
  }

  async function getComments() {
    try {
      const comments = (await axios.get(`${endpoint}/api/comments`)).data;
      success("Fetched the data successfully.");
      setData((prev) => {
        return {
          ...prev,
          comments,
        };
      });
    } catch (e) {
      somethingWentWrong(
        "It looks like there's a problem fetching the comments data."
      );
      setData((prev) => {
        return {
          ...prev,
          comments: [],
        };
      });
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
        await getSpaceImages();
      }
      if (action.method === "getById") {
        await getSpaceImagesById(action.data.id);
      }
      if (action.method === "post") {
        const image = action.data.file;
        const newData = {
          spaceId: action.data.spaceId,
          forType: action.data.forType,
          prediction: action.data.prediction,
          image,
        };
        await addSpaceImage(newData, action.data.spaceId);
        await getSpaceImagesBySpaceId(action.data.spaceId);
      }
      if (action.method === "put") {
        const newData = {
          id: action.data.id,
          spaceId: action.data.spaceId,
          forType: action.data.forType,
          prediction: action.data.prediction,
          image: action.data.image,
        };
        await updateSpaceImage(newData);
        await getSpaceImagesBySpaceId(action.data.spaceId);
      }
      if (action.method === "puts") {
        await updateSpaceImages(action.data.spaceImages);
        await getSpaceImagesBySpaceId(action.data.spaceId);
      }
      if (action.method === "delete") {
        await deleteSpaceImage(action.data.imageId);
        await getSpaceImagesBySpaceId(action.data.spaceId);
        console.log("deleted");
      }
    }
    if (action.type === "ratings") {
      if (action.method === "get") {
        await getRatings();
      }
      if (action.method === "getById") {
        await getRatingsById(action.data.id);
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
    if (action.type === "comments") {
      if (action.method === "get") {
        await getComments();
      }
    }
    if (action.type === "users") {
      if (action.method === "post") {
        try {
          // Call the addNewUser function to add the new user to the backend
          await addNewUser(action.data);

          // Fetch the updated list of users from the backend
          const updatedUsers = (await axios.get(`${endpoint}/api/user`)).data;

          // Update the state with the new list of users
          setData((prevData) => ({
            ...prevData,
            users: updatedUsers.map((user) => ({
              ...user,
              Name: `${user.firstName} ${user.lastName}`,
            })),
          }));

          console.log("Newly added users:", updatedUsers);
        } catch (error) {
          console.error("Error adding new user:", error);
        }
      }
      if (action.method === "put") {
        const updatedUserData = action.data.data; // Assuming action.data contains the updated user data
        const userId = action.data.id;

        // Extract username and password from updatedUserData

        // Perform the edit logic here, such as making a PUT request to your backend API
        try {
          // Assuming your API endpoint for updating a user is `${endpoint}/api/user/${userId}`
          await updateUser(userId, updatedUserData);

          // After successful update, update the user data in state
          setData((prevData) => {
            return {
              ...prevData,
              users: prevData.users.map((user) => {
                if (user.id === userId) {
                  // Merge existing user data with the updated data, excluding username and password
                  return {
                    ...user,
                    ...updatedUserData,
                    Name: `${updatedUserData.firstName} ${updatedUserData.lastName}`,
                  };
                }
                return user;
              }),
            };
          });
        } catch (error) {
          console.error("Error updating user:", error);
        }
      }
      if (action.method === "delete") {
        const userId = action.data.id;
        // Perform the deletion logic here, such as making a DELETE request to your backend API
        try {
          // Assuming your API endpoint for deleting a user is `${endpoint}/api/user/${userId}`
          await deleteUser(userId);
          // After successful deletion, update the users data in state
          setData((prevData) => ({
            ...prevData,
            users: prevData.users.filter((user) => user.id !== userId),
          }));
          console.log(`User with ID ${userId} deleted successfully`);
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    }
    if (action.type === "buildings") {
      // Handle the action for buildings here for post
      if (action.method === "post") {
        const newBuildingData = action.data; // Assuming action.data contains the new Building data
        console.log(newBuildingData);

        try {
          // Assuming your API endpoint for adding a Building is `${endpoint}/api/buildings`
          await addBuilding(newBuildingData);
          await getBuildings();
          console.log("Building added successfully");
        } catch (error) {
          console.error("Error adding building:", error);
        }
      }
      if (action.method === "put") {
        const updatedBuildingData = action.data; // Assuming action.data contains the updated Building data
        const buildingId = updatedBuildingData.id;
        // Perform the edit logic here, such as making a PUT request to your backend API
        try {
          // Assuming your API endpoint for updating a Building is `${endpoint}/api/user/${BuildingId}`
          await updateBuilding(buildingId, updatedBuildingData);
          await getBuildings();
          // After successful update, update the user data in state
          console.log(buildingId, updatedBuildingData);
          console.log(`Building with ID ${buildingId} updated successfully`);
        } catch (error) {
          console.error("Error updating building:", error);
        }
      }
      if (action.method === "delete") {
        const buildingName = action.data.buildingName;
        console.log(buildingName);
        // Perform the deletion logic here, such as making a DELETE request to your backend API
        try {
          // Assuming your API endpoint for deleting a building is `${endpoint}/api/buildings/${buildingName}`
          await deleteBuilding(buildingName);
          // After successful deletion, update the building data in state
          setData((prevData) => ({
            ...prevData,
            buildings: prevData.buildings.filter(
              (building) => building.buildingName !== buildingName
            ),
          }));
          console.log(
            `Building with Name ${buildingName} deleted successfully`
          );
        } catch (error) {
          console.error("Error deleting Building:", error);
        }
      }
    }
    if (action.type === "rooms") {
      if (action.method === "post") {
        let roomData = action.data;
        roomData.modifiedBy = [];
        const roomId = action.data.id;
        console.log(roomData);
        // Perform the creation logic here, such as making a POST request to your backend API
        try {
          // Assuming your API endpoint for creating a room is `${endpoint}/api/rooms`
          await addRoom(roomData);
          // After successful creation, update the room data in state there is no prevdata tho, since its newly added how to render it\
          //update the room data in state there is no prevdata tho, since its newly added how to render it
          // setData((prevData) => {
          //   return {
          //     ...prevData,
          //     rooms: [...prevData.rooms, roomData],
          //   };
          // });
          await getRooms();
          console.log("Room created successfully");
        } catch (error) {
          console.error("Error creating room:", error);
        }
      }
      if (action.method === "put") {
        const updatedRoomData = action.data; // Assuming action.data contains the updated Building data
        const roomId = updatedRoomData.id;
        // Perform the edit logic here, such as making a PUT request to your backend API
        try {
          // Assuming your API endpoint for updating a Building is `${endpoint}/api/user/${BuildingId}`
          await updateRoom(roomId, updatedRoomData);
          await getRooms();
          console.log(roomId, updatedRoomData);
          console.log(`Room with ID ${roomId} updated successfully`);
        } catch (error) {
          console.error("Error updating room:", error);
        }
      }
      if (action.method === "delete") {
        const { roomNumber, buildingId } = action.data;
        console.log(roomNumber, buildingId);
        // Perform the deletion logic here, such as making a DELETE request to your backend API
        try {
          // Assuming your API endpoint for deleting a room is `${endpoint}/api/rooms/${roomNumber}`
          await deleteRoom(roomNumber, buildingId);
          // After successful deletion, update the room data in state
          setData((prevData) => ({
            ...prevData,
            rooms: prevData.rooms.filter(
              (room) => room.roomNumber !== roomNumber
            ),
          }));
          console.log(
            `Room with number ${roomNumber} in building ${buildingId} deleted successfully`
          );
        } catch (error) {
          console.error("Error deleting room:", error);
        }
      }
      if (action.method === "get") {
        await getRooms();
        console.log("get used");
      }
    }
    if (action.type === "spaces") {
      if (action.method === "post") {
        const spaceData = action.data;
        console.log(spaceData);
        // Perform the creation logic here, such as making a POST request to your backend API
        try {
          // Assuming your API endpoint for creating a room is `${endpoint}/api/rooms`
          await addSpace(spaceData);
          //update the room data in state there is no prevdata tho, since its newly added how to render it
          await getSpaces();
          console.log("Space created successfully");
        } catch (error) {
          console.error("Error creating space:", error);
        }
      }
      if (action.method === "viewed") {
        await updateSpaceViewedDate(action.data.id);
        await getSpaces();
      }
      if (action.method === "assessed") {
        await updateSpaceAssessedDate(action.data.id);
        await getSpaces();
      }
      if (action.method === "calibrate") {
        await updateSpaceCalibrationDate(action.data.id);
        await getSpaces();
      }
      if (action.method === "put") {
        const updatedSpaceData = action.data;
        const spaceId = action.data.id;
        try {
          await updateSpace(spaceId, updatedSpaceData);
          await getSpaces();
          console.log("success");
        } catch (error) {
          console.error("Error updating space:", error);
        }
      }
      if (action.method === "delete") {
        const spaceId = action.data.id;
        console.log(spaceId);
        // Perform the deletion logic here, such as making a DELETE request to your backend API
        try {
          // Assuming your API endpoint for deleting a room is `${endpoint}/api/space/${spaceId}`
          await deleteSpace(spaceId);
          // After successful deletion, update the space data in state
          setData((prevData) => ({
            ...prevData,
            spaces: prevData.spaces.filter((space) => space.id !== spaceId),
          }));
          console.log(`Space with ID ${spaceId} deleted successfully`);
        } catch (error) {
          console.error("Error deleting space:", error);
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
    comments: data.comments,
    useEntry: handleUseEntry,
  };
  return (
    <DataContext.Provider value={dataCtx}>{children}</DataContext.Provider>
  );
}
