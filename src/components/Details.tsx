import { Skeleton } from "./ui/skeleton";

export default function Details({ title, text, isLoad }) {
  return (
    <details open>
      <summary className="hover:cursor-pointer">{title}</summary>
      {isLoad ? (
        <>
          <Skeleton className="h-6 w-[450px] mb-2" />
          <Skeleton className="h-6 w-[800px] mb-2" />
          <Skeleton className="h-6 w-[790px] mb-2" />
          <Skeleton className="h-6 w-[850px] mb-2" />
        </>
      ) : (
        <code className="text-neutral-600">{text}</code>
      )}
    </details>
  );
}
