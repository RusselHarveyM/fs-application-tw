export default function ScoreCard({
  type = "sort",
  score = 0,
  isLoad = false,
  ...props
}) {
  let cssContainerHighlight = " bg-white";
  let cssTextHighlight = " text-neutral-400";
  if (score > 3 && score < 8) {
    cssContainerHighlight = " bg-orange-300";
    cssTextHighlight = " text-white";
  } else if (score > 0 && score < 4) {
    cssContainerHighlight = " bg-red-400";
    cssTextHighlight = " text-white";
  } else if (score > 7 && score <= 10) {
    cssContainerHighlight = " bg-green-400";
    cssTextHighlight = " text-white";
  }

  return (
    <div
      className={
        "relative flex flex-col gap-4 w-64 h-32 shadow-md px-4 py-2 rounded-lg hover:cursor-pointer transition delay-150 ease-in-out hover:scale-105 hover:brightness-110" +
        cssContainerHighlight
      }
      {...props}
    >
      {isLoad && (
        <div
          className={`absolute top-0 left-0 bg-neutral-50 w-full h-full rounded-md opacity-70 animate-pulse`}
        />
      )}

      <h2 className={"text-3xl font-semibold uppercase" + cssTextHighlight}>
        {type}
      </h2>
      <code className={"text-6xl font-semibold" + cssTextHighlight}>
        {score}
      </code>
    </div>
  );
}
