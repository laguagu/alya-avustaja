import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle/db";
import { user } from "@/db/drizzle/schema";

export async function GET(request: NextRequest) {
  try {
    // Lisää testikäyttäjä
    await db.insert(user).values({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
      role: "customer",
    });

    // Hae kaikki käyttäjät
    const allUsers = await db.select().from(user);

    return NextResponse.json(allUsers);
  } catch (error) {
    return NextResponse.json({
      error: "Database operation failed",
      details: (error as Error).message,
    });
  }
}
