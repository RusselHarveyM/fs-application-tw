import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ScoreCard from "./ScoreCard";
import Comment from "./Comment";

export default function Result({
  isLoading = false,
  handleResultSelect,
  handleScoreClick,
  selectedScore,
  selectedRating,
  data,
  ratings,
}) {
  return (
    <div className="relative flex bg-white md:w-full sm:w-[42rem] gap-8 shadow-sm p-8 pt-20  rounded-lg">
      <div className="flex  w-full absolute top-5  ">
        <Select
          onValueChange={(selectedDate) => handleResultSelect(selectedDate)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Most Recent" />
          </SelectTrigger>
          <SelectContent>
            {ratings?.map((r) => {
              const date = new Date(r.dateModified);
              const formattedDate = date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              });
              return (
                <SelectItem
                  key={r.id}
                  value={r.dateModified}
                  className="hover:cursor-pointer"
                >
                  {formattedDate}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4 justify-center">
        <ScoreCard
          isLoad={isLoading}
          score={selectedRating?.sort}
          onClick={() => {
            if (selectedScore !== "sort") handleScoreClick("sort");
          }}
        />
        <ScoreCard
          isLoad={isLoading}
          type="set"
          score={selectedRating?.setInOrder}
          onClick={() => {
            if (selectedScore !== "set in order")
              handleScoreClick("set in order");
          }}
        />
        <ScoreCard
          isLoad={isLoading}
          type="shine"
          score={selectedRating?.shine}
          onClick={() => {
            if (selectedScore !== "shine") handleScoreClick("shine");
          }}
        />
      </div>
      <Comment selected={selectedScore} ratingId={selectedRating?.id} />
    </div>
  );
}
