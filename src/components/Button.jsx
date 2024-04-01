export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-4 py-2 text-xs md:text-base rounded-md text-neutral-600 hover:text-red-500"
    >
      {children}
    </button>
  );
}
