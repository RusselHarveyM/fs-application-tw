import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ScoreCard from "./ScoreCard";
import Comment from "./Comment";
import { getDateString } from "@/helper/date.js";

export default function Result({
  isLoading = false,
  handleResultSelect,
  handleScoreClick,
  selectedScore,
  selectedRating,
  ratings,
}) {
  return (
    <div className="relative flex bg-white md:w-full sm:w-[42rem] xs:transform xs:scale-90 sm:scale-100 xs:-mt-16 xs:mb-0 sm:-mt-0 gap-8 shadow-sm p-8 pt-20 rounded-lg">
      <div className="flex  w-full absolute top-5 xs:transform xs:scale-75 sm:scale-100 xs:left-0 sm:left-8">
        <Select
          onValueChange={(selectedDate) => handleResultSelect(selectedDate)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={getDateString(ratings[0].dateModified)} />
          </SelectTrigger>
          <SelectContent>
            {ratings?.map((r) => {
              const date = r.dateModified;
              const formattedDate = getDateString(date);
              return (
                <SelectItem
                  key={r.id}
                  value={date}
                  className="hover:cursor-pointer"
                >
                  {formattedDate}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4 justify-center mt-5 xs:-mr-14 sm:mr-0 xs:transform xs:scale-75 sm:scale-100 xs:mt-0">
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
