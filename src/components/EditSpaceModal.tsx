import React, { forwardRef, useImperativeHandle, useRef, useState, useContext } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";
import { DataContext } from "@/data/data-context"; // Import DataContext

const EditSpaceModal = forwardRef(function EditSpaceModal(
  {
    buttonVariant = undefined,
    buttonCaption,
    onSubmit = () => {},
    initialValues = {},
  },
  ref
) {
  const dialog = useRef();
  const { rooms } = useContext(DataContext);
  const [editedSpace, setEditedSpace] = useState(initialValues);

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal();
      setEditedSpace(initialValues); // Set initial values when modal is opened
    },
    close() {
      dialog.current.close();
    },
    setInitialValues(values) {
      setEditedSpace(values);
    },
  }));

  const handleInputChange = (event, field) => {
    setEditedSpace((prevSpace) => ({
      ...prevSpace,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const requestBody = {
      id: editedSpace.id,
      name: editedSpace.name,
      roomId: editedSpace.roomId,
      pictures: editedSpace.pictures,
      standard: null,
      viewedDate: null,
      assessedDate: null,
    };

    try {
      // Call the onSubmit handler to submit the form data
      await onSubmit(requestBody);
      // Close the modal after successful submission
      dialog.current.close();
    } catch (error) {
      console.error("Error updating building:", error);
    }
  };

  return createPortal(
    <dialog
      ref={dialog}
      className="backdrop:bg-stone-900/90 p-4 rounded-md shadow-md"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 py-8 max-w-xl mx-auto"
      >
        <div className="sm:max-w-[425px]">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-center">
              Edit Space
            </h2>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomId" className="text-right">
                Room Number:
              </Label>
              <select
                id="roomId"
                value={editedSpace.roomId}
                onChange={(e) => handleInputChange(e, "roomId")}
                className="col-span-3"
              >
                <option value="">Select a room number</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.roomNumber}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Space Name:
              </Label>
              <Input
                id="name"
                type="text"
                value={editedSpace.name}
                onChange={(e) => handleInputChange(e, "name")}
                placeholder="Space Name"
                className="col-span-3"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => dialog.current.close()}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={buttonVariant}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          >
            {buttonCaption}
          </Button>
        </div>
      </form>
    </dialog>,
    document.getElementById("modal-root")
  );
});

export default EditSpaceModal;
