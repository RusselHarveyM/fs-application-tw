export default function Button({
  variant = "default",
  liCss = "",
  children,
  cssAdOns = "",
  ...props
}) {
  const baseClasses =
    "px-4 py-2 text-xs md:text-base rounded-md text-neutral-600";
  const disabledClasses = "opacity-50 hover:cursor-not-allowed";
  const enabledClasses = "hover:cursor-pointer";

  const getVariantClasses = () => {
    switch (variant) {
      case "rose":
        return props.disabled
          ? `bg-rose-500 text-white ${disabledClasses}`
          : `bg-rose-500 text-white hover:bg-white hover:text-rose-400 ${enabledClasses}`;
      case "blue":
        return props.disabled
          ? `bg-blue-100 text-white ${disabledClasses}`
          : `bg-blue-400 text-white hover:bg-blue-200 hover:text-blue-400 ${enabledClasses}`;
      case "red":
        return `bg-red-500 text-white hover:bg-red-200 hover:text-red-400 ${enabledClasses}`;
      default:
        return props.disabled
          ? "hover:cursor-not-allowed opacity-50"
          : `hover:text-red-500 ${enabledClasses}`;
    }
  };

  const cssClasses = `${baseClasses} ${cssAdOns} ${getVariantClasses()}`;

  return (
    <li className={`${liCss} list-none`}>
      <button {...props} className={cssClasses}>
        {children}
      </button>
    </li>
  );
}
