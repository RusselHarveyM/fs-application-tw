export default function ImageTab({ img, label, isSelected }) {
  let cssClasses =
    "w-28 h-28 object-contain hover:scale-110 rounded-full hover:brightness-100";
  if (isSelected) {
    cssClasses += " bg-stone-200 scale-110 brightness-100";
  } else {
    cssClasses += " brightness-95";
  }
  return (
    <img src={img} alt={`${label}-data-tab-icon`} className={cssClasses} />
  );
}
