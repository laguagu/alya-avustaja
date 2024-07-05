import "@/db/drizzle/envConfig"; // Varmista, että ympäristömuuttujat ladataan ensin
import { insertUser } from "@/db/drizzle/db";
import { NewUser } from "@/db/drizzle/schema";
import bcrypt from "bcrypt";

async function main() {
  const plainPassword = "123456";
  const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash the password

  const newUser: NewUser = {
    name: "user2",
    email: "user2@example.com",
    password: hashedPassword,
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
