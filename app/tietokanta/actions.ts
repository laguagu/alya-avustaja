'use server';
import { db } from '@/db/drizzle/db';
import { users } from '@/db/drizzle/schema';
import { revalidatePath } from 'next/cache';

export const AddUser = async (formData: FormData) => {
  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;

  await db.insert(users).values({ fullName, phone }).returning();

  // Revalidate the path to fetch the updated users list
  revalidatePath('/tietokanta');
};

export const getUsers = async () => {
  const allUsers = await db.select().from(users);
  return allUsers;
};