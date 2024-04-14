import CircularProgress from "./CircularProgress";

export default function Card({ title, score }) {
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
    <div className="relative  flex flex-col shadow gap-1 bg-white rounded-2xl w-[22%] h-[10rem] px-6 py-8">
      <h2 className="text-lg text-neutral-600 font-semibold">{title}</h2>
      <p className={`font-bold text-2xl ${textTheme} `}>{score}/ 10</p>
      <p className="text-neutral-400 ">+20.1% from last month</p>
      <div className="absolute -right-28 h-10">
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
