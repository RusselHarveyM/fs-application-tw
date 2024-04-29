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

  return (
    <div className="relative  flex flex-col shadow gap-1 bg-white rounded-2xl md:w-[22%] sm:w-[24%] h-[10rem] px-6 py-8">
      <h2 className="md:text-lg sm:text-md text-neutral-600 font-semibold">
        {title}
      </h2>
      <p
        className={`font-bold md:text-2xl sm:text-lg sm:pl-8 sm:pt-2 md:pl-0 ${textTheme} `}
      >
        {score}/ 10
      </p>
      <p className="text-neutral-400 md:text-base sm:text-sm sm:pt-2 ">
        +{percent} from last month
      </p>
      <div className="absolute sm:-left-32 sm:bottom-16  sm:h-8 md:h-10 md:left-28 md:top-6 ">
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
