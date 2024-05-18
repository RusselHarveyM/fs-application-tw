export default function ImageTab({
  img,
  label,
  isSelected,
  isDisabled = false,
}) {
  let cssClasses =
    "md:w-15 md:h-15 sm:w-16 sm:h-16 xs:w-16 xs:h-16 object-contain hover:scale-120 rounded-full hover:brightness-100";
  if (isDisabled) {
    cssClasses =
      "md:w-15 md:h-15 sm:w-16 sm:h-16 xs:w-16 xs:h-16 object-contain rounded-full hover:cursor-not-allowed";
  }
  if (isSelected && !isDisabled) {
    cssClasses += " bg-rose-200 scale-110 brightness-110";
  } else {
    cssClasses += " brightness-90";
  }
  return (
    <img src={img} alt={`${label}-data-tab-icon`} className={cssClasses} />
  );
}
