// app/api/class/route.ts
import { db } from "@/lib/drizzle";
import { classes } from "@/lib/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Insert the new class and return the created record
    const [newClass] = await db.insert(classes).values(body).returning();
    const note_id = generateNoteId(newClass.title);

    const baseUrl = process.env.LIMI_BASE_URL;
    if (!baseUrl) {
      console.error("LIMI_BASE_URL is not set.");
      return NextResponse.json(
        { error: "AI backend not configured" },
        { status: 500 },
      );
    }

    const addPdfEndpoint = `${baseUrl}/add-pdf`;

    const addPdfBody = {
      drive_url: newClass.notes?.[0] || "",
      note_id,
      title: newClass.title,
    };

    const pdfResponse = await fetch(addPdfEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(addPdfBody),
    });

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      console.error("PDF upload failed:", errorText);
    }
    return NextResponse.json({
      success: true,
      class: newClass,
    });
  } catch (error) {
    console.error("Insert error:", error);
    return NextResponse.json(
      { error: "Failed to insert class" },
      { status: 500 },
    );
  }
}

function generateNoteId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  const timestamp = Date.now().toString(36);
  return `${slug}_${timestamp}`;
}
