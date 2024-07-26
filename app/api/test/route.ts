import { NextRequest } from "next/server";
import { decrypt } from "@/app/_auth/sessions";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  // const cookie = cookies().get('session')?.value;
  // const session = await decrypt(cookie);

  // if (!session?.userId) {
  //   return new Response(JSON.stringify({ message: 'Unauthorized' }), {
  //     status: 401,
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  // }

  console.log("Läpi meni");
  return Response.json("LÄPI MENI");
}
