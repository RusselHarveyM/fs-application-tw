export default function ScoreCard({ type = "sort", score = 0 }) {
  return (
    <div className="flex flex-col gap-4 w-64 h-32 bg-white shadow-md px-4 py-2 rounded-lg hover:cursor-pointer transition delay-150 ease-in-out hover:scale-105 hover:brightness-110">
      <h2 className="text-3xl font-semibold text-neutral-400 uppercase">
        {type}
      </h2>
      <code className="text-6xl font-semibold text-neutral-400">{score}</code>
    </div>
  );
}
