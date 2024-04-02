export default function Container({
  img,
  title,
  code,
  noOfChildren,
  ...props
}) {
  return (
    <div
      {...props}
      className="flex hover:scale-105 hover:brightness-105 rounded-xl justify-start gap-4 items-center shadow-sm border-2 border-neutral-200 bg-neutral-100 py-2 px-4 w-80"
    >
      {img ? (
        <img
          src={img}
          alt={`${title}-image`}
          className="w-24 h-24 object-contain rounded-xl bg-white"
        />
      ) : (
        <div className="w-24 h-24 object-contain rounded-xl bg-white animate-pulse"></div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <h2>{title}</h2>
          <p className="font-bold">{code}</p>
        </div>
        <p className="text-sm">{noOfChildren}</p>
      </div>
    </div>
  );
}
