import { createServerClient } from '@supabase/ssr'
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )
  
  const { data: notes } = await supabase.from("notes").select();

  return (
    <ul>
      {notes!.map((note: any) => (
        <li key={note.id}>
          {note.title}: {note.body}
        </li>
      ))}
    </ul>
  );
}
