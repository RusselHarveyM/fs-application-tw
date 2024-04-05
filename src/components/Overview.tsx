import CircularProgress from "./CircularProgress";

export default function Overview() {
  return (
    <div className="flex flex-col p-6 w-[82rem] mx-auto">
      <div className="flex flex-col bg-white w-full gap-8 shadow-sm py-8 px-16 rounded-lg">
        <h2 className="text-2xl text-neutral-500 font-bold">Overview</h2>
        <div className="flex">
          <CircularProgress
            percent={10}
            strokeColor="#1dd75b"
            trailColor="#b8f5cd"
          />
        </div>
      </div>
    </div>
  );
}
