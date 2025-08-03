import { db } from "@/lib/drizzle";
import { classes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop(); // Get ID from the URL

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const body = await req.json();

    const [updatedClass] = await db
      .update(classes)
      .set(body)
      .where(eq(classes.id, id))
      .returning();

    if (!updatedClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      updated: updatedClass,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop(); // Get ID from the URL

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const [deletedClass] = await db
      .delete(classes)
      .where(eq(classes.id, id))
      .returning();

    if (!deletedClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      deletedId: id,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
