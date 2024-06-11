import ClientForm from "@/components/issues/ClientForm";
import { IssueFormValues } from "@/data/vikailmoitusMockData";
import { apiData } from "@/data/vikailmoitusMockData";

// Api fetch
// async function fetchLunniFormData(id: string): Promise<IssueFormValues> {
//   const response = await fetch(
//     `https://apiv3.lunni.io/services/${id}?fields=location_id,priority,problem_description,type,instruction,used_equipments`,
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.LUNNI_API}`, // Replace with your actual access token
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Failed to fetch data");
//   }

//   const data = await response.json();
//   return {
//     location_id: data.location_id ?? null,
//     priority: data.priority ?? "",
//     problem_description: data.problem_description ?? "",
//     type: data.type ?? "",
//     instruction: data.instruction ?? "",
//     used_equipments: data.used_equipments ?? "",
//   };
// }

// Käytetään mockattua dataa
async function fetchLunniFormData(id: string): Promise<IssueFormValues> {
  const data = apiData.find((item) => item.id.toString() === id);

  if (!data) {
    throw new Error("Failed to fetch data");
  }

  return {
    // location_id: data.location_id ?? null,
    priority: data.priority ?? "",
    problem_description: data.problem_description ?? "",
    type: data.type ?? "",
    instruction: data.instruction ?? "",
    used_equipments: data.used_equipments ?? "",
  };
}

export default async function Page({ params }: { params?: { id?: string } }) {
  const data = params?.id ? await fetchLunniFormData(params.id) : null;
  return (
    <div>
      <h1 className="text-center text-2xl">Vikailmoitus - {params?.id}</h1>
      <ClientForm data={data} />
    </div>
  );
}
