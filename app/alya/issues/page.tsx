import { Payment, columns, FurnitureItem } from "./columns";
import { DataTable } from "./data-table";

// async function getData(): Promise<Payment[]> {
//   // Fetch data from your API here.
//   const payment: Payment = {
//     id: "728ed52f",
//     amount: 100,
//     status: "pending",
//     email: "m@example.com",
//     alyaHankeMaksu: true,
//   };

//   const differentPayment: Payment = {
//     id: "123456",
//     amount: 200,
//     status: "processing",
//     email: "test@example.com",
//     alyaHankeMaksu: false,
//   };

//   const payments = Array(10).fill(payment);
//   payments.push(differentPayment);

//   return payments;
// }
async function getData(): Promise<FurnitureItem[]> {
  const FurnitureItems = await fetch(
    "https://6549f6b1e182221f8d523a44.mockapi.io/api/kalusteet"
  )
  const data = await FurnitureItems.json();
  console.log(data)
  return data;
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
