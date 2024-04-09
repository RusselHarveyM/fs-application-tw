import Details from "./Details";
import { Skeleton } from "./ui/skeleton";

export default function Comment({ isLoad = false }) {
  return (
    <article className="flex flex-col gap-4 w-full h-90 border-dashed border-4 rounded-lg  py-4 px-6">
      {isLoad ? (
        <Skeleton className="h-6 w-[100px]" />
      ) : (
        <h2 className="uppercase text-xl font-semibold">SORT</h2>
      )}

      <Details
        isLoad={isLoad}
        title="Summary"
        text={` Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Reprehenderit suscipit vero dolores fugiat natus tempora quidem
      voluptates libero, praesentium, atque aut? Pariatur, provident rem
      quod hic minus quis id non?`}
      />
      <Details
        isLoad={isLoad}
        title="Things to improve"
        text={` Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Reprehenderit suscipit vero dolores fugiat natus tempora quidem
      voluptates libero, praesentium, atque aut? Pariatur, provident rem
      quod hic minus quis id non?`}
      />
    </article>
  );
}
