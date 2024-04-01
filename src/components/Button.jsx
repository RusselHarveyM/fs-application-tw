export default function Button({ children, cssAdOns, ...props }) {
  let cssClasses =
    "px-4 py-2 text-xs md:text-base rounded-md text-neutral-600 hover:text-red-500 hover:cursor-pointer " +
    cssAdOns;
  return (
    <button {...props} className={cssClasses}>
      {children}
    </button>
  );
}
