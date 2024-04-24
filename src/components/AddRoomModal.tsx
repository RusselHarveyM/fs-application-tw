import { forwardRef, useImperativeHandle, useRef, useState, useContext } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";
import { DataContext } from "@/data/data-context"; // Import DataContext

const AddRoomModal = forwardRef(function AddRoomModal(
  {
    buttonVariant = undefined,
    buttonCaption,
    onSubmit = () => {},
    initialValues = {},
  },
  ref
) {
  const dialog = useRef();
  const [formData, setFormData] = useState(initialValues);
  const [newRoom, setNewRoom] = useState({
    id: "",
    buildingId: "",
    roomNumber: "",
    image: "",
    status: "",
  });

  const { buildings } = useContext(DataContext); // Get buildings from DataContext

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal();
      setFormData(initialValues); // Reset form data when modal is opened
    },
    close() {
      dialog.current.close();
    },
    setInitialValues(values) {
      setFormData(values);
    },
  }));

  function handleInputChange(event, field) {
    setNewRoom({ ...newRoom, [field]: event.target.value });
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // The result contains the data URL of the image
      const base64String = reader.result.split(",")[1]; // Extract base64 data from result
      setNewRoom({ ...newRoom, image: base64String });
      const imgElement = document.getElementById("preview") as HTMLImageElement;
      imgElement.src = reader.result as string;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Find the building ID based on the selected building name
    const selectedBuilding = buildings.find((building) => building.buildingName === newRoom.buildingId);
    const buildingId = selectedBuilding ? selectedBuilding.id : "";

    const requestBody = {
      buildingId: buildingId,
      roomNumber: newRoom.roomNumber,
      image: newRoom.image,
      status: newRoom.status,
    };

    onSubmit(requestBody);
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
              Add Room
            </h2>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="buildingId" className="text-right">
                Building Name:
              </Label>
              <select
                id="buildingId"
                value={newRoom.buildingId}
                onChange={(e) => handleInputChange(e, "buildingId")}
                className="col-span-3"
              >
                <option value="">Select a building</option>
                {buildings &&
                  buildings.map((building) => (
                    <option key={building.id} value={building.buildingName}>
                      {building.buildingName}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomNumber" className="text-right">
                Room Number:
              </Label>
              <Input
                id="roomNumber"
                type="text"
                value={newRoom.roomNumber}
                onChange={(e) => handleInputChange(e, "roomNumber")}
                placeholder="Room Number"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status:
              </Label>
              <Input
                id="status"
                type="text"
                value={newRoom.status}
                onChange={(e) => handleInputChange(e, "status")}
                placeholder="Status"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Upload Image:
              </Label>
              <div className="relative w-64">
                <Input 
                  id="image" 
                  type="file"
                  onChange={handleImageUpload} 
                  className="opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer" 
                />
                <div className="bg-white border border-gray-300 rounded-md py-2 px-5">
                  <span className="block truncate">
                    Choose image file
                  </span>
                </div>
              </div>
            </div>
            <img id="preview" className="h-24 w-full object-contain" />
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

export default AddRoomModal;
