import { useContext, useRef } from "react";
import { Button } from "@/components/ui/button";
import AddSpaceModal from "@/components/AddSpaceModal";
import { Plus } from "lucide-react";
import { DataContext } from "@/data/data-context";

// Add button component
const AddSpaceButton = () => {
  const addSpaceModal = useRef();
  const { useEntry } = useContext(DataContext);

  async function handleAddSpace(spaceData) {
    try {
      const spaceDataWithId = { ...spaceData, id: "string", pictures: null };
  
      const action = {
        type: "spaces",
        method: "post",
        data: spaceDataWithId,
      };
  
      // Call the useEntry function to add a new space
      console.log(spaceDataWithId);
      useEntry(action);
      console.log(spaceDataWithId);
      console.log(`Space added successfully`);
      addSpaceModal.current.close(); // Close the modal after successful addition
    } catch (error) {
      console.error("Error adding space:", error);
    }
  }

  return (
    <>
      <AddSpaceModal
        ref={addSpaceModal}
        onSubmit={handleAddSpace}
        buttonCaption="Add Entry"
        buttonVariant="red"
      />
      <Button
        variant="ghost"
        className="flex items-center ml-2"
        onClick={() => addSpaceModal.current.open()}
      >
        <span className=" hidden sm:inline">Add Space</span>
        <Plus className="h-4 w-4 sm:hidden"/>
      </Button>
    </>
  );
};

export { AddSpaceButton }; // Export the AddSpaceButton component
