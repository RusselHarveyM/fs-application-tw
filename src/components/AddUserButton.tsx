import React, { useContext, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";
import { DataContext } from "@/data/data-context";
import AddUserModal from "@/components/AddUserModal";

const AddUserButton = ({ buttonVariant }) => {
  const addUserModal = useRef();
  const { useEntry } = useContext(DataContext);

  async function handleAddUser(userData) {
    try {
      const userDataWithId = { ...userData, Id: "string" }; // Include id with a placeholder value
      const action = {
        type: "users",
        method: "post",
        data: userDataWithId,
      };
      // Call the useEntry function to add a new user
      console.log(userDataWithId);
      useEntry(action);
      console.log(`User added successfully`);
      addUserModal.current.close(); // Close the modal after successful addition
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }

  return (
    <>
      <AddUserModal
        ref={addUserModal}
        onSubmit={handleAddUser} // Pass handleAddUser as onSubmit handler
        buttonCaption="Add Entry"
        buttonVariant="red"
      />
      <Button
        variant="ghost"
        className="flex items-center ml-2"
        onClick={() => addUserModal.current.open()} // Open the AddUserModal when button is clicked
      >
        <span className=" hidden sm:inline"> Add User</span>
        <UserRoundPlus className="h-4 w-4 sm:hidden" />
      </Button>
    </>
  );
};

export { AddUserButton };
