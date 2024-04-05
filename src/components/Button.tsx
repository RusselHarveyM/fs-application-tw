export default function Button({
  variant = "default",
  liCss = "",
  children,
  cssAdOns = "",
  ...props
}) {
  let cssClasses =
    "px-4 py-2 text-xs md:text-base rounded-md text-neutral-600 hover:text-red-500 hover:cursor-pointer " +
    cssAdOns;
  if (variant === "blue") {
    cssClasses +=
      " bg-blue-400 text-white hover:bg-blue-200 hover:text-blue-400";
  }
  return (
    <li className={liCss + " list-none"}>
      <button {...props} className={cssClasses}>
        {children}
      </button>
    </li>
  );
}
