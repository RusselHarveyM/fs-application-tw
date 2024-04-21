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

export type User = {
  id: string;
  lastName: string;
  firstName: string;
  username: string;
  role: string;
  fullName: string;
};

import { useContext, useRef } from "react";
import Modal from "@/components/Modal";
import EditUserModal from "@/components/EditUserModal";
import { DataContext } from "@/data/data-context";
import AddUserModal from "@/components/AddUserModal";

export const userColumns: ColumnDef<User>[] = [
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
    accessorKey: "Name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span
        className={`inline-block px-2 py-1 rounded-full ${
          row.original.role === "admin"
            ? "bg-purple-200 text-purple-800"
            : "bg-blue-200 text-blue-800"
        }`}
      >
        {row.original.role}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const editUserModal = useRef();
      const deleteModal = useRef();
      const { useEntry } = useContext(DataContext); // Get useEntry function from DataContext

      async function handleUserEdit(data) {
        try {
          const action = {
            type: "users",
            method: "put",
            data: {
              id: user.id,
              data: { id: user.id, ...data },
            },
          };
          // Call the useEntry function to update the user
          useEntry(action);
          // console.log(`User with ID ${user.id} updated successfully`);
          editUserModal.current.close(); // Close the modal after successful update
        } catch (error) {
          console.error("Error updating user:", error);
        }
      }

      async function handleUserDelete() {
        try {
          const action = {
            type: "users",
            method: "delete",
            data: {
              id: user.id,
            },
          };
          // Call the useEntry function to delete the user
          useEntry(action);
          console.log(`User with ID ${user.id} deleted successfully`);
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }

      function handleDropdownSelect(selected) {
        if (selected === "edit") {
          editUserModal.current.open();
        } else if (selected === "delete") {
          deleteModal.current.open(user); // Open delete modal with user object
        }
      }

      return (
        <>
          <EditUserModal
            buttonCaption="Edit Entry"
            buttonVariant="blue"
            ref={editUserModal}
            onSubmit={handleUserEdit} // Pass handleUserEdit as onSubmit handler
            initialValues={user} // Pass the selected user's data as initialValues
          />
          <Modal
            buttonCaption="Delete Entry"
            buttonVariant="red"
            ref={deleteModal}
            onSubmit={handleUserDelete}
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
