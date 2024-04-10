import { Skeleton } from "./ui/skeleton";

export default function Details({ title, text, isLoad, list = false }) {
  return (
    <details open>
      <summary className="hover:cursor-pointer mb-4">{title}</summary>
      {isLoad ? (
        <>
          <Skeleton className="h-6 w-[450px] mb-2" />
          <Skeleton className="h-6 w-[800px] mb-2" />
          <Skeleton className="h-6 w-[790px] mb-2" />
          <Skeleton className="h-6 w-[850px] mb-2" />
        </>
      ) : (
        <code className={`${list && "grid grid-cols-2"} text-neutral-600 `}>
          {list ? (
            <ul className="list-disc">
              {text.map((item, index) => {
                if (item !== "")
                  return (
                    <li className="ml-8" key={index}>
                      {item}
                    </li>
                  );
              })}
            </ul>
          ) : (
            <>{text}</>
          )}
        </code>
      )}
    </details>
  );
}
