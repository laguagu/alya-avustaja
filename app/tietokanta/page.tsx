import { AddUser, getUsers } from '@/app/tietokanta/actions';
import { db } from '@/db/drizzle/db';
import { user } from '@/db/drizzle/formSchema';

type User = {
  id: number;
  fullName: string | null;
  phone: string | null;
};


export default async function Home() {
  // const users: User[] = await getUsers();

  return (
    <div>
      <h1>Users</h1>
      <form action={AddUser}>
        <input type="text" name="fullName" placeholder="Full Name" required />
        <input type="text" name="phone" placeholder="Phone" required />
        <button type="submit">Add User</button>
      </form>
      <ul>
        {users.map((user:User) => (
          <li key={user.id}>
            {user.fullName} - {user.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}