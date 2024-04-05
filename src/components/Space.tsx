import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <div className="flex flex-col bg-white w-full gap-8 shadow-sm p-8 rounded-lg">
        <img
          src=""
          alt="space-image"
          className="w-[45rem] h-[25rem] bg-neutral-500 rounded-xl"
        />
      </div>
    </div>
  );
}
