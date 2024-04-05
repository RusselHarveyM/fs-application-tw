import { Leaf } from "lucide-react";

export default function NoSpace() {
  return (
    <div className="flex m-auto w-[40rem] justify-center h-32 ">
      <h2 className="flex gap-4 text-neutral-400 text-2xl text-center">
        Currenly there are no space...
        <span>
          <Leaf />
        </span>
      </h2>
    </div>
  );
}
