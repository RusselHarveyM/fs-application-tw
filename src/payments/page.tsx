import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

export const payments: Payment[] = [
  {
    id: "728ed52f",
    lastname: "Doe",
    firstname: "JOhn",
    username: "m@example.com",
  },
  {
    id: "489e1d42",
    lastname: "Moe",
    firstname: "Hanz",
    username: "example@gmail.com",
  },
  // ...
];

// async function getData(): Promise<Payment[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       id: "728ed52f",
//       amount: 100,
//       status: "pending",
//       email: "m@example.com",
//     },
//     // ...
//   ];
// }

export default function page() {
  // const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={payments} />
    </div>
  );
}
