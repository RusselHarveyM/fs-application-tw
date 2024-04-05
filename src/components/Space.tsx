import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageGallery from "./ImageGallery";
import Button from "./Button";
import ScoreCard from "./ScoreCard";
import Details from "./Details";

export default function Space() {
  return (
    <div className="flex flex-col gap-4 p-6 w-[82rem] mx-auto">
      <div className="flex flex-col bg-white w-full gap-8 shadow-sm py-8 px-16 rounded-lg">
        <div className="flex justify-between">
          <h2 className="text-neutral-600 text-2xl font-bold">Space</h2>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Space" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Space 1">Space 1</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex  bg-white w-full gap-8 shadow-sm p-8 rounded-lg">
        <div className="flex flex-col justify-between w-2/3">
          <img
            src=""
            alt="space-image"
            className=" h-[25rem] bg-neutral-100 rounded-xl"
          />
          <menu className="flex gap-4 justify-end">
            <Button variant="blue">Upload</Button>
            <Button variant="blue">Assess</Button>
          </menu>
        </div>
        <ImageGallery images={[]} />
      </div>
      <div className="flex bg-white w-full gap-8 shadow-sm p-8 rounded-lg">
        <div className="flex flex-col gap-4 justify-center">
          <ScoreCard />
          <ScoreCard type="set" />
          <ScoreCard type="shine" />
        </div>
        <article className="flex flex-col gap-4 w-full h-90 border-dashed border-4 rounded-lg bg-neutral-100 py-4 px-6">
          <h2 className="uppercase text-xl font-semibold">SORT</h2>
          <Details
            title="Summary"
            text={` Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reprehenderit suscipit vero dolores fugiat natus tempora quidem
              voluptates libero, praesentium, atque aut? Pariatur, provident rem
              quod hic minus quis id non?`}
          />
          <Details
            title="Things to improve"
            text={` Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reprehenderit suscipit vero dolores fugiat natus tempora quidem
              voluptates libero, praesentium, atque aut? Pariatur, provident rem
              quod hic minus quis id non?`}
          />
        </article>
      </div>
    </div>
  );
}
