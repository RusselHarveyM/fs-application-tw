export default function Container({
  img,
  title,
  code,
  noOfChildren = 0,
  ...props
}) {
  return (
    <button
      {...props}
      className="flex transition ease-in delay-50 hover:scale-105 hover:brightness-105 rounded-xl justify-start gap-4 items-center shadow-sm border-2 border-neutral-200 bg-white py-2 px-4 w-80 h-32"
    >
      {img ? (
        <img
          src={`data:image/jpeg;base64,${img}`}
          alt={`${title}-image`}
          className="w-24 h-24 object-contain object-fill rounded-xl bg-white"
        />
      ) : (
        <div className="w-24 h-24 object-contain rounded-xl bg-neutral-200 animate-pulse"></div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          {title ? (
            <h2 className="w-fit">{title}</h2>
          ) : (
            <h2 className="bg-neutral-200 rounded-xl animate-pulse w-36 h-4" />
          )}
          {code ? (
            <p className="font-bold w-fit">{code}</p>
          ) : (
            <p className="bg-neutral-200 rounded-xl animate-pulse w-16 mt-2 h-4" />
          )}
        </div>
        {noOfChildren ? (
          <p className="text-sm w-fit">{noOfChildren}</p>
        ) : (
          <p className="bg-neutral-200 rounded-xl animate-pulse w-8 mt-2 h-4" />
        )}
      </div>
    </button>
  );
}
