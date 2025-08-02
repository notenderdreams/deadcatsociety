import { db } from "@/lib/drizzle";
import { events } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const body = await req.json();
    const params = await context.params;

    const updatedEvent = await db
      .update(events)
      .set(body)
      .where(eq(events.id, params.id))
      .returning();

    if (updatedEvent.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEvent[0]);
  } catch (error: unknown) {
    console.error("Error updating event (API Route):", error);
    let errorMessage = "Failed to update event";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } },
) {
  try {
    const params = await context.params;

    const deletedEvent = await db
      .delete(events)
      .where(eq(events.id, params.id))
      .returning();

    if (deletedEvent.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting event:", error);
    let errorMessage = "Failed to delete event";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
