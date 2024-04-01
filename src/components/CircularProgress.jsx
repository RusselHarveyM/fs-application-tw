import { Circle } from "rc-progress";

export default function CircularProgress({
  percent,
  title,
  strokeColor,
  trailColor,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 object-contain w-80 h-full relative">
      <p
        className="absolute top-0 bottom-10 left-0 right-0 m-auto text-5xl font-bold flex items-center justify-center"
        style={{
          color: strokeColor,
          height: "fit-content",
          width: "fit-content",
        }}
      >
        {percent}%
      </p>
      <Circle
        percent={percent}
        trailWidth={18}
        strokeWidth={18}
        strokeLinecap="butt"
        trailColor={trailColor}
        strokeColor={strokeColor}
      />
      <h2
        className="text-3xl font-bold uppercase"
        style={{ color: strokeColor }}
      >
        {title}
      </h2>
    </div>
  );
}
