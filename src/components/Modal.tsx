import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

const Modal = forwardRef(function Modal(
  {
    children,
    buttonVariant = undefined,
    buttonCaption,
    onSubmit = () => {},
    onClose = () => {},
    input = <></>,
  },
  ref
) {
  const dialog = useRef();

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
      close() {
        dialog.current.close();
      },
    };
  });

  return createPortal(
    <dialog
      ref={dialog}
      className="backdrop:bg-stone-900/90 p-4 rounded-md shadow-md"
    >
      {children}
      <form method="dialog" action="post" className="flex flex-col gap-4 ">
        {input}
        <div className="flex justify-end gap-4">
          <Button onClick={onClose}>Close</Button>
          <Button variant={buttonVariant} onClick={onSubmit}>
            {buttonCaption}
          </Button>
        </div>
      </form>
    </dialog>,
    document.getElementById("modal-root")
  );
});

export default Modal;
