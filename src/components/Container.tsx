export default function Container({
  img = "",
  title = "",
  code = "",
  selectedTab = "buildings",
  noOfChildren = 0,
  ...props
}) {
  let containerStatusCss = "";

  if (code === "healthy") {
    containerStatusCss = " border-green-300 bg-green-100 text-green-500";
  } else if (code === "warning") {
    containerStatusCss = " border-orange-300 bg-orange-100 text-orange-500";
  } else if (code === "critical") {
    containerStatusCss = " border-red-300 bg-red-100 text-red-500";
  } else {
    containerStatusCss = "border-neutral-200 bg-white";
  }

  return (
    <button
      {...props}
      className={`flex transition ease-in delay-50 hover:scale-105 hover:brightness-105 rounded-xl justify-start gap-4 items-center shadow-sm border-2 ${containerStatusCss}  py-2 px-4 w-full md:max-w-[20rem] md:h-28 sm:max-w-[15rem] sm:h-30 xs:max-w-[10rem] xs:h-25 hover:cursor-pointer`}
    >
      {img ? (
        <img
          src={`data:image/jpeg;base64,${img}`}
          alt={`${title}-image`}
          className="w-16 h-16 md:w-20 md:h-20 sm:w-14 sm:h-14 xs:w-10 xs:h-10 rounded-xl bg-white object-cover"
        />
      ) : (
        <div className="w-16 h-16 md:w-20 md:h-20 sm:w-14 sm:h-14 xs:w-10 xs:h-10 rounded-xl bg-neutral-200 animate-pulse"></div>
      )}

      <div className="flex items-start flex-col gap-2">
        <div className="flex flex-col gap-2 items-start">
          {title ? (
            <h2 className="text-sm md:text-base sm:text-sm xs:text-xs truncate  md:w-auto">
              {title}
            </h2>
          ) : (
            <div className="bg-neutral-200 rounded-xl animate-pulse w-16 md:w-20 sm:w-16 xs:w-10 h-4" />
          )}
          {code ? (
            <p className="font-bold text-xs md:text-sm sm:text-xs xs:text-xs truncate">
              {code}
            </p>
          ) : (
            <div className="bg-neutral-200 rounded-xl animate-pulse w-8 md:w-12 sm:w-8 xs:w-6 h-4" />
          )}
        </div>
        {noOfChildren ? (
          <p className="text-xs">
            {noOfChildren} {selectedTab === "buildings" ? "rooms" : "spaces"}
          </p>
        ) : (
          <div className="bg-neutral-200 rounded-xl animate-pulse w-6 md:w-8 sm:w-6 xs:w-4 h-4" />
        )}
      </div>
    </button>
  );
}
