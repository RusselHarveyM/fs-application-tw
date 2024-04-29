export default function Container({
  img = "",
  title = "",
  code = "",
  noOfChildren = 0,
  ...props
}) {
  return (
    <button
      {...props}
      className="flex transition ease-in delay-50 hover:scale-105 hover:brightness-105 rounded-xl justify-start gap-4 items-center shadow-sm border-2 border-neutral-200 bg-white py-2 px-4 md:w-80 md:h-32  sm:w-44 sm:h-20"
    >
      {img ? (
        <img
          src={`data:image/jpeg;base64,${img}`}
          alt={`${title}-image`}
          className="md:w-24 md:h-24 sm:w-16 sm:h-16 rounded-xl bg-white"
        />
      ) : (
        <div className="md:w-24 md:h-24 sm:w-16 sm:h-16 object-contain rounded-xl bg-neutral-200 animate-pulse"></div>
      )}

      <div className="flex flex-col md:gap-4 sm:gap-2">
        <div>
          {title ? (
            <h2 className="w-fit md:text-base sm:text-xs">{title}</h2>
          ) : (
            <h2 className="bg-neutral-200 rounded-xl animate-pulse md:w-36 sm:16 h-4" />
          )}
          {code ? (
            <p className="font-bold w-fit md:text-base sm:text-sm">{code}</p>
          ) : (
            <p className="bg-neutral-200 rounded-xl animate-pulse md:w-16 md:mt-2 h-4" />
          )}
        </div>
        {noOfChildren ? (
          <p className="text-sm w-fit">{noOfChildren}</p>
        ) : (
          <p className="bg-neutral-200 rounded-xl animate-pulse w-8 md:mt-2 h-4" />
        )}
      </div>
    </button>
  );
}
