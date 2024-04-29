import { Circle } from "rc-progress";

export default function CircularProgress({
  percent,
  title = undefined,
  strokeColor,
  trailColor,
  isLoad = false,
  average = false,
  display = true,
}) {
  let loadCss = "animate-spin";
  return (
    <div
      className={`flex flex-col items-center w-80 justify-center gap-4 object-contain  h-full relative ${
        isLoad && loadCss
      }`}
    >
      <p
        className={`absolute top-0 ${
          title ? "bottom-10" : "bottom-0"
        } left-0 right-0 m-auto md:text-5xl sm:text-4xl font-bold flex items-center justify-center`}
        style={{
          color: strokeColor,
          height: "fit-content",
          width: "fit-content",
        }}
      >
        {display
          ? !isLoad
            ? average
              ? percent + " /10"
              : percent + " %"
            : ""
          : ""}
      </p>
      <Circle
        percent={average ? percent * 10 : percent}
        trailWidth={18}
        strokeWidth={18}
        strokeLinecap="butt"
        trailColor={trailColor}
        strokeColor={strokeColor}
      />
      {title && (
        <h2
          className="md:text-3xl sm:text-xl font-bold uppercase"
          style={{ color: strokeColor }}
        >
          {title}
        </h2>
      )}
    </div>
  );
}
