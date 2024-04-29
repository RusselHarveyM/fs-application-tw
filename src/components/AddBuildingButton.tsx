import React, { useContext, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataContext } from "@/data/data-context";
import AddBuildingModal from "@/components/AddBuildingModal";

const AddBuildingButton = () => {
  const addBuildingModal = useRef();
  const { useEntry } = useContext(DataContext);

  async function handleAddBuilding(buildingData) {
    try {
      const buildingDataWithId = { ...buildingData, Id: "string" }; // Include id with a placeholder value
      const action = {
        type: "buildings",
        method: "post",
        data: buildingDataWithId,
      };
      // Call the useEntry function to add a new building
      console.log(buildingDataWithId);
      useEntry(action);
      console.log(`Building added successfully`);
      addBuildingModal.current.close(); // Close the modal after successful addition
    } catch (error) {
      console.error("Error adding building:", error);
    }
  }

  return (
    <>
      <AddBuildingModal
        ref={addBuildingModal}
        onSubmit={handleAddBuilding}
        buttonCaption="Add Entry"
        buttonVariant="red"
      />
      <Button
        variant="ghost"
        className="flex items-center ml-2"
        onClick={() => addBuildingModal.current.open()}
      >
        <span className=" hidden sm:inline"> Add Building</span>
        <Plus className="h-4 w-4 sm:hidden"/>
      </Button>
    </>
  );
};

export { AddBuildingButton };
