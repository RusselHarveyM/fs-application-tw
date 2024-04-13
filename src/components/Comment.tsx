import Details from "./Details";
import { Skeleton } from "./ui/skeleton";
import { useContext } from "react";
import { DataContext } from "@/data/data-context";

export default function Comment({ isLoad = false, selected, ratingId }) {
  const { comments } = useContext(DataContext);

  let thingsToImprove = [];
  let summary;

  if (comments) {
    const filteredComments = comments.filter(
      (comment) => comment.ratingId === ratingId
    );
    if (filteredComments.length > 0) {
      const comment =
        selected === "set in order"
          ? filteredComments[0].setInOrder
          : selected === "sort"
          ? filteredComments[0].sort
          : selected === "shine"
          ? filteredComments[0].shine
          : undefined;

      if (comment) {
        // Extract summary and things to improve
        const summaryRegex = /Summary:\s*(.*)\s*Things to improve:\s*(.*)/;
        const matches = comment.match(summaryRegex);
        if (matches && matches.length === 3) {
          summary = matches[1];
          thingsToImprove = matches[2].split("*");
        }

        // Remove titles using regex
        summary = summary?.replace(/(\bSummary:\b)/i, "")?.trim();
        thingsToImprove = thingsToImprove.map((item) =>
          item?.replace(/(\bThings to improve:\b)/i, "")?.trim()
        ); // Apply the replace and trim to each item in the array
      }
    }
  }

  return (
    <article className="flex flex-col gap-4 w-full h-90 border-dashed border-4 rounded-lg  py-4 px-6">
      {isLoad ? (
        <Skeleton className="h-6 w-[100px] bg-neutral-200" />
      ) : (
        <h2
          className={`text-neutral-600 text-xl font-semibol ${
            selected === "" ? " animate-pulse" : "uppercase"
          }`}
        >
          {selected !== "" ? selected : "Please click a score card"}
        </h2>
      )}
      {(selected !== "" || isLoad) && (
        <>
          <Details isLoad={isLoad} title="Summary" text={summary} />
          <Details
            isLoad={isLoad}
            list={true}
            title="Things to improve"
            text={thingsToImprove}
          />
        </>
      )}
    </article>
  );
}
