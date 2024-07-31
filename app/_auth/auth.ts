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
  try {
    // 1. Validate form fields
    const validatedFields = LoginFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    const errorMessage = { message: "Virheelliset kirjautumistiedot." };

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
      console.log("Validation failed", validatedFields.error);
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
      console.log("User not found:", validatedFields.data.email);
      return errorMessage;
    }

    // 3. Compare the user's password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(
      validatedFields.data.password,
      user.password,
    );

    // If the password does not match, return early
    if (!passwordMatch) {
      console.log(
        "Password does not match for user:",
        validatedFields.data.email,
      );
      return { message: "Virheelliset kirjautumistiedot." };
    }
    // 4. If login successful, create a session for the user and redirect
    await createSession(user.id, user.role);
  } catch (error) {
    console.error("Login error:", error);
    return { message: "An error occurred during login. Please try again." };
  }
  redirect("/alya");
}

export async function logout() {
  deleteSession();
}
