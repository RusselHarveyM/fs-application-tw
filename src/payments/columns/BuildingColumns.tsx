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
import Modal from "@/components/Modal";
import { useContext, useRef } from "react";
import { DataContext } from "@/data/data-context";
import EditBuildingModal from "@/components/EditBuildingModal";
import AddBuildingModal from "@/components/AddBuildingModal";

export type Building = {
  id: string;
  buildingName: string;
  buildingCode: string;
  image: string;
};

export const buildingColumns: ColumnDef<Building>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    accessorKey: "buildingName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Building Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "buildingCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Building Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <img
        src={`data:image/png;base64,${row.original.image}`}
        alt="Building Image"
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const building = row.original;
      const editBuildingModal = useRef();
      const deleteModal = useRef();
      const { useEntry } = useContext(DataContext); // Get useEntry function from DataContext

      async function handleBuildingEdit(updatedBuildingData) {
        console.log("here >> ", updatedBuildingData);
        console.log("here2 >> ", building.id);
        const newBuildingData = {
          buildingCode: updatedBuildingData.buildingCode,
          buildingName: updatedBuildingData.buildingName,
          image: updatedBuildingData.image,
        };
        try {
          const action = {
            type: "buildings",
            method: "put",
            data: {
              id: updatedBuildingData.id,
              ...newBuildingData,
            },
          };
          // Call the useEntry function to update the user
          useEntry(action);
          console.log(`Building with ID ${building.id} updated successfully`);
          editBuildingModal.current.close(); // Close the modal after successful update
        } catch (error) {
          console.error("Error updating building:", error);
        }
      }

      async function handleBuildingDelete() {
        try {
          const action = {
            type: "buildings",
            method: "delete",
            data: {
              buildingName: building.buildingName,
            },
          };
          // Call the useEntry function to delete the building
          useEntry(action);
          console.log(
            `Building with Name ${building.buildingName} deleted successfully`
          );
        } catch (error) {
          console.error("Error deleting building:", error);
        }
      }

      function handleDropdownSelect(selected) {
        if (selected === "edit") {
          editBuildingModal.current.open();
        } else if (selected === "delete") {
          deleteModal.current.open(building);
        }
      }

      return (
        <>
          <EditBuildingModal
            buttonCaption="Edit Entry"
            buttonVariant="blue"
            ref={editBuildingModal}
            onSubmit={handleBuildingEdit}
            initialValues={building}
          />
          <Modal
            buttonCaption="Delete Entry"
            buttonVariant="red"
            ref={deleteModal}
            onSubmit={handleBuildingDelete}
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
