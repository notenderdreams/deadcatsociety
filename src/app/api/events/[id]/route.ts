import { db } from "@/lib/drizzle";
import { events } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    }

    const body = await req.json();

    const updatedEvent = await db
      .update(events)
      .set(body)
      .where(eq(events.id, id))
      .returning();

    if (updatedEvent.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEvent[0]);
  } catch (error: unknown) {
    console.error("Error updating event (API Route):", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update event",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    }

    const deletedEvent = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning();

    if (deletedEvent.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete event",
      },
      { status: 500 },
    );
  }
}
