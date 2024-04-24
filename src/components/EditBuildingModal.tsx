import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

const EditBuildingModal = forwardRef(function EditBuildingModal(
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const updatedBuildingData = { ...formData };
    // const { id } = formData;
    // updatedBuildingData.id = id;

    // console.log("before here>>> ", updatedBuildingData);
    try {
      // Call the onSubmit handler to submit the form data
      await onSubmit(updatedBuildingData);
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
        <div className="flex flex-col">
          <label htmlFor="buildingName" className="text-sm mb-2 text-center">
            Building Name:
          </label>
          <input
            type="text"
            id="buildingName"
            name="buildingName"
            value={formData.buildingName}
            onChange={handleChange}
            className="input rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="buildingCode" className="text-sm mb-2 text-center">
            Building Code:
          </label>
          <input
            type="text"
            id="buildingCode"
            name="buildingCode"
            value={formData.buildingCode}
            onChange={handleChange}
            className="input rounded-md"
          />
        </div>
        {/* Add input for images */}
        <div className="flex flex-col">
          <label htmlFor="images" className="text-sm mb-2 text-center">
            Images:
          </label>
          <input
            type="file"
            id="images"
            name="images"
            multiple // Allow multiple image selection
            onChange={handleChange}
            className="input rounded-md"
          />
        </div>
        <div className="flex justify-between">
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

export default EditBuildingModal;
