import { forwardRef, useImperativeHandle, useRef, useState, useContext } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";
import { DataContext } from "@/data/data-context"; // Import DataContext

const AddSpaceModal = forwardRef(function AddSpaceModal(
  {
    buttonVariant = undefined,
    buttonCaption,
    onSubmit = () => {},
    initialValues = {},
    isEditing = false,
  },
  ref
) {
  const dialog = useRef();
  const [formData, setFormData] = useState(initialValues);
  // const [newSpace, setNewSpace] = useState({
  //   id: "",
  //   name: "",
  //   roomId: "",
  //   pictures: null,
  // });

  const { rooms } = useContext(DataContext); // Get rooms from DataContext
  const [newSpace, setNewSpace] = useState(initialValues);

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal();
      setNewSpace(initialValues); // Reset form data when modal is opened
    },
    close() {
      dialog.current.close();
    },
    setInitialValues(values) {
      setNewSpace(values);
    },
  }));

  const handleInputChange = (event, field) => {
    setNewSpace((prevSpace) => ({
      ...prevSpace,
      [field]: event.target.value,
    }));
  };  
  
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    const requestBody = {
      id: newSpace.id,
      name: newSpace.name,
      roomId: newSpace.roomId,
      pictures: newSpace.pictures,
    };

    onSubmit(requestBody).then((response) => {
      const { roomId } = response.data; // Assuming the response contains the generated roomId
      setNewSpace((prevSpace) => ({ ...prevSpace, id: roomId }));
    }); // Pass request to onSubmit handler
    dialog.current.close(); // Close the modal after submission
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
              {isEditing ? "Edit Space" : "Add Space"}
            </h2>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomId" className="text-right">
                Room Number:
              </Label>
              <select
                id="roomId"
                value={newSpace.roomId}
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
                value={newSpace.name}
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

export default AddSpaceModal;
