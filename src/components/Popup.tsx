import { createPortal } from "react-dom";

export default function Popup({ children }) {
  return createPortal(
    <div className="md:w-1/3 mx-auto sm:w-2/5 bg-white absolute top-28 left-1/3 text-xs md:text-base py-2 px-12 text-center shadow rounded-full m-auto hover:shadow-md hover:cursor-pointer animate-slide-in-top">
      {children}
    </div>,
    document.getElementById("modal-root") as Element
  );
}
