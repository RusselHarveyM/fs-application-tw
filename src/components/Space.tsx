import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageGallery from "./ImageGallery";
import Button from "./Button";

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
        <ImageGallery />
      </div>
      <div className="flex flex-col bg-white w-full gap-8 shadow-sm p-8 rounded-lg">
        <h2>Scores</h2>
        <div>
          <div className="w-64 h-64 bg-green-400"></div>
        </div>
      </div>
    </div>
  );
}
