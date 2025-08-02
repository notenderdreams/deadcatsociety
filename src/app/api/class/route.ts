// app/api/class/route.ts
import { db } from "@/lib/drizzle";
import { classes } from "@/lib/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Insert the new class and return the created record
    const [newClass] = await db.insert(classes).values(body).returning();

    return NextResponse.json({
      success: true,
      class: newClass,
    });
  } catch (error) {
    console.error("Insert error:", error);
    return NextResponse.json(
      { error: "Failed to insert class" },
      { status: 500 }
    );
  }
}
