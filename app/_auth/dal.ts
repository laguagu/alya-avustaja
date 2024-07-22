import 'server-only';
import { db } from '@/db/drizzle/db'; 
import { eq } from 'drizzle-orm';
import { cache } from 'react';
import { users } from '@/db/drizzle/schema'; 
import { verifySession } from './sessions'; 

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),

      // Explicitly return the columns you need rather than the whole user object
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    const user = data[0];

    return user;
  } catch (error) {
    console.log('Failed to fetch user');
    return null;
  }
});
