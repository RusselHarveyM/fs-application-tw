import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

const EditUserModal = forwardRef(function EditUserModal(
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
  const roleRef = useRef();
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();

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
    }
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const data = { 
        role : roleRef.current.value,
        firstName : firstnameRef.current.value,
        lastName : lastnameRef.current.value,
        username : usernameRef.current.value,
        password : passwordRef.current.value
    }
    console.log(usernameRef.current.value);
    console.log(passwordRef.current.value);
    onSubmit(data); // Pass current form data to onSubmit handler
    dialog.current.close(); // Close the modal after submission
  };

  return createPortal(
    <dialog
      ref={dialog}
      className="backdrop:bg-stone-900/90 p-4 rounded-md shadow-md"
    >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-8 max-w-xl mx-auto">
            <div className="flex flex-col">
                <label htmlFor="role" className="text-sm mb-2 text-center">Role:</label>
                <select
                id="role"
                name="role"
                ref ={roleRef}
                className="input rounded-md"
                >
                <option value="admin">Admin</option>
                <option value="user">User</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label htmlFor="firstName" className="text-sm mb-2 text-center">First Name:</label>
                <input
                type="text"
                id="firstName"
                name="firstName"
                ref ={firstnameRef}
                className="input rounded-md"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="lastName" className="text-sm mb-2 text-center">Last Name:</label>
                <input
                type="text"
                id="lastName"
                name="lastName"
                ref ={lastnameRef}
                className="input rounded-md"
                />
            </div>
                <div className="flex flex-col">
                    <label htmlFor="username" className="text-sm mb-2 text-center">Username:</label>
                    <input
                    type="text"
                    id="username"
                    name="username"
                    ref ={usernameRef}
                    className="input rounded-md"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password" className="text-sm mb-2 text-center">Password:</label>
                    <input
                    type="password"
                    id="password"
                    name="password"
                    ref = {passwordRef}
                    className="input rounded-md"
                    />
                </div>
            <div className="flex justify-between">
                <Button type="button" onClick={() => dialog.current.close()} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">Cancel</Button>
                <Button type="submit" variant={buttonVariant} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline">{buttonCaption}</Button>
            </div>
        </form>
    </dialog>,
    document.getElementById("modal-root")
  );
});

export default EditUserModal;
