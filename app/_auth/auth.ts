"use server";

import { db } from "@/db/drizzle/db";
import { users } from "@/db/drizzle/schema";
import { FormState, LoginFormSchema } from "@/app/_auth/definitions";
import { createSession, deleteSession } from "@/app/_auth/sessions";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function login(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  // 1. Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const errorMessage = { message: "Invalid login credentials." };

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  // 2. Query the database for the user with the given email
  const user = await db.query.users.findFirst({
    where: eq(users.email, validatedFields.data.email),
  });

  // If user is not found, return early
  if (!user) {
    console.error("user not found");
    return errorMessage;
  }
  // 3. Compare the user's password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(
    validatedFields.data.password,
    user.password,
  );
  // 3. Compare the user's password with the plaintext password in the database (not recommended for production)
  // const passwordMatch = validatedFields.data.password === user.password;

  // If the password does not match, return early
  if (!passwordMatch) {
    console.error("password not match");
    return errorMessage;
  }

  // 4. If login successful, create a session for the user and redirect
  const userId = user.id.toString(); // Dokumentaatiossa esimerkki stateless-session mukaan jossa vaadittini string
  await createSession(user.id, user.role);
  redirect("/alya");
}

export async function logout() {
  deleteSession();
}
