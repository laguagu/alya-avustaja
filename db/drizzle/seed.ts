import '@/db/drizzle/envConfig'; // Varmista, että ympäristömuuttujat ladataan ensin
import { insertUser } from '@/db/drizzle/db';
import { NewUser } from '@/db/drizzle/schema';

async function main() {
  const newUser: NewUser = {
    name: 'user',
    email: 'user@example.com',
    password: '123456',
  };
  try {
    const res = await insertUser(newUser);
    console.log('Successfully seeded users table:', res);
  } catch (error) {
    console.error('Error seeding users table:', error);
  } finally {
    process.exit();
  }
}

main();