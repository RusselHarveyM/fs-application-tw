import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRef } from "react";
import Modal from "@/components/Modal";

export type Room = {
  id: string;
  buildingId: string;
  roomNumber: string;
  image: string;
};

export const roomColumns: ColumnDef<Room>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const editModal = useRef();
      const deleteModal = useRef();

      function handleDropdownSelect(selected){
        selected === "edit"
          ? editModal.current.open()  
          : deleteModal.current.open();
      }

      return (
        <>
          <Modal
            buttonCaption="Edit Entry"
            buttonVariant="blue"
            ref={editModal}
          >
            <p>Edit</p>
          </Modal>
          <Modal
            buttonCaption="Delete Entry"
            buttonVariant="red"
            ref={deleteModal}
          >
            <p>Are you sure you want to delete?</p>
          </Modal>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleDropdownSelect("edit")}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDropdownSelect("delete")}>
                  Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
