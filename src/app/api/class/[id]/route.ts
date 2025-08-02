import { db } from "@/lib/drizzle";
import { classes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    // Perform update and return the updated data
    const [updatedClass] = await db
      .update(classes)
      .set(body)
      .where(eq(classes.id, params.id))
      .returning();

    if (!updatedClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Return updated data for optimistic update
    return NextResponse.json({
      success: true,
      updated: updatedClass,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [deletedClass] = await db
      .delete(classes)
      .where(eq(classes.id, params.id))
      .returning();

    if (!deletedClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Return deleted ID so the client can remove it optimistically
    return NextResponse.json({
      success: true,
      deletedId: params.id,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
