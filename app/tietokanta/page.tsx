import {fetchUsers} from '@/app/actions';

type User = {
  id: number;
  name: string | null;
  email: string | null;
  // password: string | null;
};


export default async function Page() {
  const users: User[] = await fetchUsers();
  return (
    <div>
      <h1>Users</h1>
      <form>
        <input type="text" name="fullName" placeholder="Full Name" required />
        <input type="text" name="phone" placeholder="Phone" required />
        <button type="submit">Add User</button>
      </form>
      <ul>
        {users.map((user:User) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}