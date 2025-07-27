// app/api/class/route.ts
import { db } from "@/lib/drizzle";
import { classes } from "@/lib/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await db.insert(classes).values(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Insert error:", error);
    return NextResponse.json({ error: "Failed to insert" }, { status: 500 });
  }
}
