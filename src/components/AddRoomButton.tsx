import React, { useContext, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataContext } from "@/data/data-context";
import AddRoomModal from "@/components/AddRoomModal";

const AddRoomButton = () => {
  const addRoomModal = useRef();
  const { useEntry } = useContext(DataContext);

  async function handleAddRoom(roomData) {
    try {
      const roomDataWithId = { ...roomData, Id: "string" }; // Include id with a placeholder value
      const action = {
        type: "rooms",
        method: "post",
        data: roomDataWithId,
      };
      // Call the useEntry function to add a new room
      console.log(roomDataWithId);
      useEntry(action);
      console.log(`Room added successfully`);
      addRoomModal.current.close(); // Close the modal after successful addition
    } catch (error) {
      console.error("Error adding room:", error);
    }
  }

  return (
    <>
      <AddRoomModal
        ref={addRoomModal}
        onSubmit={handleAddRoom}
        buttonCaption="Add Entry"
        buttonVariant="red"
      />
      <Button
        variant="ghost"
        className="flex items-center ml-2"
        onClick={() => addRoomModal.current.open()}
      >
        <span className=" hidden sm:inline">Add Room</span>
        <Plus className="h-4 w-4 sm:hidden"/>
      </Button>
    </>
  );
};

export { AddRoomButton };
