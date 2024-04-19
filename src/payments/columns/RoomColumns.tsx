import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContext, useRef } from "react";
import Modal from "@/components/Modal";
import { DataContext } from "@/data/data-context";
import AddRoomModal from "@/components/AddRoomModal";
import EditRoomModal from "@/components/EditRoomModal";

export type Room = {
  id: string;
  buildingId: string;
  roomNumber: string;
  image: string;
  status: string;
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
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const room = row.original;
      const editRoomModal = useRef();
      const deleteModal = useRef();
      const { useEntry } = useContext(DataContext); // Get useEntry function from DataContext

      async function handleRoomEdit(updatedRoomData) {
        console.log("here >> ", updatedRoomData);
        console.log("here2 >> ", room.id);
        const newRoomData = {
          buildingId: updatedRoomData.buildingId,
          roomNumber: updatedRoomData.roomNumber,
          image: updatedRoomData.image,
          status: updatedRoomData.status,
        };
        try {
          const action = {
            type: "rooms",
            method: "put",
            data: {
              id: updatedRoomData.id,
              ...newRoomData,
            },
          };
          // Call the useEntry function to update the user
          useEntry(action);
          console.log(`Room with ID ${room.id} updated successfully`);
          editRoomModal.current.close(); // Close the modal after successful update
        } catch (error) {
          console.error("Error updating building:", error);
        }
      }

      async function handleRoomDelete() {
        try {
          const action = {
            type: "rooms",
            method: "delete",
            data: {
              roomNumber: room.roomNumber,
              buildingId: room.buildingId
            },
          };
          // Call the useEntry function to delete the room
          useEntry(action);
          console.log(`Room with number ${room.roomNumber} in building ${room.buildingId} deleted successfully`);
        } catch (error) {
          console.error('Error deleting room:', error);
        }
      }

      function handleDropdownSelect(selected) {
        if (selected === "edit") {
          editRoomModal.current.open();
        } else if (selected === "delete") {
          deleteModal.current.open(room); 
        }
      }

      return (
        <>
          <EditRoomModal
          buttonCaption="Edit Entry"
          buttonVariant="blue"
          onSubmit={handleRoomEdit}
          ref={editRoomModal}
          initialValues={room}
          />
          <Modal
            buttonCaption="Delete Entry"
            buttonVariant="red"
            ref={deleteModal}
            onSubmit={handleRoomDelete}
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
