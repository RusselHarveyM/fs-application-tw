export default function ImageTab({
  img,
  label,
  isSelected,
  isDisabled = false,
}) {
  let cssClasses =
    "md:w-28 md:h-28 sm:w-16 sm:h-16 object-contain hover:scale-110 rounded-full hover:brightness-100";
  if (isDisabled) {
    cssClasses =
      "md:w-28 md:h-28 sm:w-16 sm:h-16 object-contain rounded-full hover:cursor-not-allowed";
  }
  if (isSelected && !isDisabled) {
    cssClasses += " bg-stone-200 scale-110 brightness-100";
  } else {
    cssClasses += " brightness-90";
  }
  return (
    <img src={img} alt={`${label}-data-tab-icon`} className={cssClasses} />
  );
}
