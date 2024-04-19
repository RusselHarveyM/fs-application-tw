export default function Button({
  variant = "default",
  liCss = "",
  children,
  cssAdOns = "",
  ...props
}) {
  let cssClasses =
    "px-4 py-2 text-xs md:text-base rounded-md text-neutral-600  " + cssAdOns;
  if (variant === "blue") {
    if (props.disabled === true) {
      cssClasses += " bg-blue-100 text-white hover:cursor-not-allowed";
    } else {
      cssClasses +=
        " bg-blue-400 text-white hover:bg-blue-200 hover:text-blue-400 hover:cursor-pointer";
    }
  } else if (variant === "red") {
    cssClasses +=
      " bg-red-500 text-white hover:bg-red-200 hover:text-red-400 hover:cursor-pointer";
  } else {
    cssClasses += " hover:text-red-500 hover:cursor-pointer";
  }
  return (
    <li className={liCss + " list-none"}>
      <button {...props} className={cssClasses}>
        {children}
      </button>
    </li>
  );
}
