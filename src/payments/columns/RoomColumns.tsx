import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type Room = {
  id: string;
  buildingId: string;
  roomNumber: string;
  image: string;
};

export const roomColumns: ColumnDef<Room>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "buildingId",
    header: "Building Id",
  },
  {
    accessorKey: "roomNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Room Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <img src={`data:image/jpeg;base64,${row.original.image}`} alt="Room Image" />
    ),
  },
];
