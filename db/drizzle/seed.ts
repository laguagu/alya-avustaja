import "@/db/drizzle/envConfig"; // Varmista, että ympäristömuuttujat ladataan ensin
import { insertUser } from "@/db/drizzle/db";
import { NewUser } from "@/db/drizzle/schema";
import bcrypt from "bcrypt";

async function main() {
  const plainPassword = process.env.ADMIN_PASSWORD;
  const userEmail = process.env.ADMIN_EMAIL;
  // const plainPassword = process.env.USER_PASSWORD;
  // const userEmail = process.env.USER_EMAIL;

  if (!plainPassword || !userEmail) {
    console.error(
      "SEED_USER_PASSWORD and SEED_USER_EMAIL environment variables are required.",
    );
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash the password

  const newUser: NewUser = {
    name: "user",
    email: userEmail,
    password: hashedPassword,
    role: "user",
  };

  try {
    const res = await insertUser(newUser);
    console.log("Successfully seeded users table:", res);
  } catch (error) {
    console.error("Error seeding users table:", error);
  } finally {
    process.exit();
  }
}

main();
