"use client";

import * as React from "react";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { AlignCenter, Plus } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/Modal";
import { Label } from "@radix-ui/react-dropdown-menu";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tableContent: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  tableContent,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [currentPage, setCurrentPage] = React.useState(1);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  console.log('tableContent:', tableContent); 
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },

  });
  
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

  const [newUser, setNewUser] = useState({
    id: "",
    lastName: "",
    firstName: "",
    username: "",
    role: "",
    password: ""
  });
  const [newBuilding, setNewBuilding] = useState({
    id: "",
    buildingName: "",
    buildingCode: "",
    image: "",
  });

  const addModal = React.useRef();
  const uploadModal = React.useRef();

  function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // The result contains the data URL of the image
      const imgElement = document.getElementById("preview") as HTMLImageElement;
      console.log(imgElement.src);
      imgElement.src = reader.result as string;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function handleImageSubmit(event) {
    event.preventDefault();
    uploadModal.current.close();
    console.log(event);
  }

  function handleInputChange(event, field) {
    if (tableContent === 'users') {
      setNewUser({ ...newUser, [field]: event.target.value });
    } else if (tableContent === 'buildings') {
      setNewBuilding({ ...newBuilding, [field]: event.target.value });
    }
  }
  
  function handleAddEntry() {
    // Construct the request body
    let requestBody;
  
    if (tableContent === 'users') {
      requestBody = {
        id: newUser.id,
        lastName: newUser.lastName,
        firstName: newUser.firstName,
        username: newUser.username,
        role: newUser.role,
        password: newUser.password
      };
    } else if (tableContent === 'buildings') {
      requestBody = {
        id: newBuilding.id,
        buildingName: newBuilding.buildingName,
        buildingCode: newBuilding.buildingCode,
        image: newBuilding.image
      };
    }
    
    // Perform the POST request
    fetch(
      tableContent === 'users'
        ? 'https://fs-backend-copy-production.up.railway.app/api/user'
        : 'https://fs-backend-copy-production.up.railway.app/api/building',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      }
    )
    .then(response => {
      if (!response.ok) {
        throw new Error(
          tableContent === 'users' 
            ? 'Failed to add user' 
            : 'Failed to add building'
        );
      }
      return response.json();
    })
    .then(data => {
      console.log(
        `New ${tableContent} added successfully:`,
        data
      );
      // Reset state after saving
      if (tableContent === 'users') {
        setNewUser({
          id: '',
          lastName: '',
          firstName: '',
          username: '',
          role: '',
          password: ''
        });
      } else if (tableContent === 'buildings') {
        setNewBuilding({
          id: '',
          buildingName: '',
          buildingCode: '',
          image: ''
        });
      }
      closeAddModal();
    })
    .catch(error => {
      console.error(`Error adding ${tableContent}:`, error);
      // Handle error, e.g., display error message to user
    });
  }
  
  function openAddModal() {
    addModal.current.open();
  }

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder={
            tableContent === 'users'
              ? 'Search by Username'
              : tableContent === 'buildings'
              ? 'Search by Building Code'
              : tableContent === 'rooms'
              ? 'Search by Room Number'
              : tableContent === 'spaces'
              ? 'Search by Name'
              : 'Search'
          }
          value={
            tableContent === 'users'
              ? (
                  (table.getColumn("username")?.getFilterValue() as string)
                  ?? ""
                )
              : tableContent === 'buildings'
              ? (
                  (table.getColumn("buildingCode")?.getFilterValue() as string)
                  ?? ""
                )
              : tableContent === 'rooms'
              ? (
                  (table.getColumn("roomNumber")?.getFilterValue() as string)
                  ?? ""
                )  
              : tableContent === 'spaces'
              ? (
                  (table.getColumn("name")?.getFilterValue() as string)
                  ?? ""
                )   
              : ""
          }
          onChange={(event) =>
            table.getColumn(
              tableContent === 'users'
                ? "username"
                : tableContent === 'buildings'
                ? "buildingCode"
                : tableContent === 'rooms'
                ? "roomNumber"
                : tableContent === 'spaces'
                ? "name"
                : ""
            )?.setFilterValue(event.target.value)
          }
          className="max-w-sm mi-4"
        />
        {tableContent === 'users' && (
          <>
            <Button variant="outline" className="ml-2" style={{ backgroundColor: '#D70040', color: 'white'}} onClick={openAddModal}>Add Entry <Plus /> </Button>
            <Modal 
              ref={addModal}
              onSubmit={handleAddEntry}
              buttonVariant="red"
              buttonCaption="Submit"
            >
              <div className="sm:max-w-[425px]">
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-center">Add User</h2>
                </div>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">Role:</Label>
                    <select
                      id="role"
                      value={newUser.role}
                      onChange={(e) => handleInputChange(e, "role")}
                      className="col-span-3"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastName" className="text-right">Last Name:</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={newUser.lastName}
                        onChange={(e) => handleInputChange(e, "lastName")}
                        placeholder="Last Name"
                        className="col-span-3"
                      />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstName" className="text-right">First Name:</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={newUser.firstName}
                        onChange={(e) => handleInputChange(e, "firstName")}
                        placeholder="First Name"
                        className="col-span-3"
                      />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">Username:</Label>
                      <Input
                        id="username"
                        type="text"
                        value={newUser.username}
                        onChange={(e) => handleInputChange(e, "username")}
                        placeholder="Username"
                        className="col-span-3"
                      />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">Password:</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => handleInputChange(e, "password")}
                        placeholder="*************"
                        className="col-span-3"
                      />
                  </div>
                </div>
              </div>
            </Modal>
          </>
        )}
        {tableContent === "buildings" && (
          <>
            <Button
              variant="outline"
              className="ml-2"
              style={{ backgroundColor: "#D70040", color: "white" }}
              onClick={() => addModal.current.open()}
            >
              Add Building <Plus />
            </Button>
            <Modal
              ref={addModal}
              onSubmit={handleAddEntry}
              buttonVariant="red"
              buttonCaption="Submit"
            >
              <div className="sm:max-w-[425px]">
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-center">
                    Add Building
                  </h2>
                </div>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="buildingName" className="text-right">
                      Building Name:
                    </Label>
                    <Input
                      id="buildingName"
                      type="text"
                      value={newBuilding.buildingName}
                      onChange={(e) => handleInputChange(e, "buildingName")}
                      placeholder="Building Name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="buildingCode" className="text-right">
                      Building Code:
                    </Label>
                    <Input
                      id="buildingCode"
                      type="text"
                      value={newBuilding.buildingCode}
                      onChange={(e) => handleInputChange(e, "buildingCode")}
                      placeholder="Building Code"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="image" className="text-right">Upload Image:</Label>
                    <div className="relative w-64">
                      <Input id="picture" type="file" onChange={handleImageUpload} className="opacity-0 absolute left-0 top-0 w-full h-full cursor-pointer" />
                      <div className="bg-white border border-gray-300 rounded-md py-2 px-5">
                        <span className="block truncate">Choose image file</span>
                      </div>
                    </div>
                  </div>
                  <img id="preview" className="h-24 w-full object-contain" />
                </div>
              </div>
            </Modal>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto mr-1">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => {
            setCurrentPage(() => 1);
            table.setPageIndex(0);
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <p>
          {currentPage} of {table.getPageCount()}
        </p>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
        > 
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => {
            const page = table.getPageCount() - 1;
            setCurrentPage(() => page + 1);
            table.setPageIndex(page);
          }}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
      {/* <div>
        {selectedRowCount > 0 && (
          <p>{selectedRowCount} item(s) selected</p> //count the selected items in the table by checkbox
        )}
      </div> */}
    </div>
  );
}
