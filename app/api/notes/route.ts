// app/api/notes/route.ts
import { db } from "@/lib/drizzle"; // your drizzle client
import { semesters, courses, classes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const semesterRows = await db.select().from(semesters);
    const courseRows = await db.select().from(courses);
    const classRows = await db.select().from(classes);

    const data = {
      semesters: semesterRows.map((semester) => ({
        ...semester,
        courses: courseRows
          .filter((c) => c.semester_id === semester.id)
          .map((course) => ({
            ...course,
            classes: classRows.filter((cls) => cls.course_id === course.id),
          })),
      })),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
