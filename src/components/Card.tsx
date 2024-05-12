import CircularProgress from "./CircularProgress";

export default function Card({ title, score, percent = "20.1%" }) {
  let textTheme = "";
  let circularCss = "";
  let trailCss = "";
  if (score > 0 && score < 5) {
    textTheme = "text-red-400 ";
    circularCss = "#fc0303";
    trailCss = "#ff9999";
  } else if (score > 4 && score < 8) {
    textTheme = "text-orange-300 ";
    circularCss = "#ffaa00";
    trailCss = "#ffda91";
  } else if (score > 7) {
    textTheme = "text-green-400 ";
    circularCss = "#1dd75b";
    trailCss = "#b8f5cd";
  }
  let percentInt = parseInt(percent);
  let changeIndicator;

  return (
    <div className="relative flex flex-col shadow gap-1 bg-white rounded-2xl sm:h-[10rem] md:w-[22%] sm:w-[24%] xs:w-[32%] xs:transform xs:scale-75 xs:h-[6rem] xs:-mr-5 xs:-ml-5 xs:py-2 sm:scale-100 sm:px-6 sm:py-8">
      <h2 className="md:text-lg xs:transform xs:scale-75 sm:scale-100 sm:text-sm text-neutral-600 font-semibold xs:w-[6rem] sm:w-[10rem]">
        {title}
      </h2>
      <p
        className={`font-bold md:text-2xl xs:transform xs:scale-75 xs:pl-6 sm:scale-100 sm:text-lg sm:pl-8 sm:pt-2 md:pl-0 ${textTheme} `}
      >
        {score}/ 10
      </p>
      <p className={` text-neutral-400 md:text-sm xs:transform xs:scale-75 sm:scale-100 sm:text-xs sm:pt-2 xs:text-xs `}>
        <span className="font-bold">{percent}</span> from last month
      </p>
      <div className="absolute sm:-left-32 sm:bottom-16 xs:transform xs:scale-75 xs:-left-36 xs:-mr-4 xs:bottom-9 xs:h-6 sm:scale-75 md:scale-100 sm:h-8 md:h-10 md:left-28 md:top-9 ">
        <CircularProgress
          percent={score}
          average={true}
          display={false}
          strokeColor={circularCss}
          trailColor={trailCss}
        />
      </div>
    </div>
  );
}
