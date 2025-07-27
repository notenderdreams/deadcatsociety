// notes/[semester]/page.tsx
"use client";

import React, { useMemo } from "react"; // Import useMemo
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { useParams, useRouter } from "next/navigation";
import { useDatabaseStore } from "@/lib/store/useDatabaseStore"; // Import the store hook

export default function SemesterGrid() {
  const router = useRouter();
  const params = useParams();
  const semesterParam = params.semester as string;

  // --- Zustand Integration ---
  const { getSemesterById, getActiveSemester } = useDatabaseStore(); // Get helper functions

  // Find the semester object based on the URL parameter or default to active
  const semesterData = useMemo(() => {
    if (semesterParam) {
      // Try to find by ID if semesterParam is numeric, otherwise by name
      const id = parseInt(semesterParam, 10);
      if (!isNaN(id)) {
        return getSemesterById(id);
      } else {
        // If semesterParam is a name (like "Summer-2025"), you'd need another helper
        // For now, assume ID is used in URL or fallback logic is handled
        // Let's assume ID is used or find by name if needed.
        // This part depends on how your semester URLs are structured.
        // If it's the name, you might need to adjust the mockData helper or add a getSemesterByName.
        // For simplicity, let's assume it's the ID for now, or handle it more robustly.
        // Let's try ID first, then name.
        const foundById = getSemesterById(id);
        if (foundById) return foundById;

        // Fallback: Find by name (requires name to match exactly, consider slugifying)
        return useDatabaseStore
          .getState()
          .data.semesters.find(
            (s) =>
              s.name.replace(/\s+/g, "-").toLowerCase() ===
              semesterParam.toLowerCase()
          );
      }
    }
    // If no param, maybe show active semester?
    return getActiveSemester();
  }, [semesterParam, getSemesterById, getActiveSemester]); // Recalculate when these change

  // Derive courses from the found semester data
  const courses = useMemo(() => {
    return (
      semesterData?.courses.map((course) => ({
        id: course.id, // Add ID for key and navigation
        code: course.code,
        classes: course.classes.length, // Count classes
        lastUpdated: new Date(course.updated_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }), // Format date
        // Add any other course properties you need for display
      })) || []
    );
  }, [semesterData]); // Recalculate when semesterData changes

  // --- End Zustand Integration ---

  const handleCourseClick = (courseId: string) => {
    // Use course ID now
    if (!semesterData?.id) {
      // Use semester ID from data
      console.error("Semester data or ID is missing");
      return;
    }
    // Navigate using the course ID or code. Let's use the course code formatted for URL.
    const course = semesterData.courses.find((c) => c.id === courseId);
    if (course) {
      const formattedCourseCode = course.code.replace(/\s+/g, "-");
      router.push(
        `/notes/${semesterData.id || semesterData.name}/${formattedCourseCode}`
      ); // Use semester ID or name from data
    }
  };

  if (!semesterData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Semester not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full flex justify-center p-24">
        <h1 className="w-full px-64 text-4xl font-semibold font-serif tracking-tight">
          {semesterData.name} {/* Use name from data */}
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center px-4">
        <div className="grid grid-cols-3 border-t border-l border-neutral-300 max-w-6xl w-full">
          {courses.map(
            (
              course // Use derived courses
            ) => (
              <div
                key={course.id} // Use course ID
                className="relative border-b border-r border-neutral-300 p-8 h-64 flex flex-col justify-between cursor-pointer group overflow-hidden transition-colors duration-300 hover:bg-neutral-900"
                onClick={() => handleCourseClick(course.id)} // Pass course ID
              >
                {/* GridPattern on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0">
                  <div className="relative flex size-full items-center justify-center overflow-hidden rounded-lg p-20">
                    <GridPattern
                      width={20}
                      height={20}
                      x={-1}
                      y={-1}
                      strokeDasharray="4,2"
                      className={cn(
                        "[mask-image:linear-gradient(to_bottom_left,white,transparent,transparent)]",
                        "stroke-white/20"
                      )}
                    />
                  </div>
                </div>
                {/* Text Content */}
                <div className="relative z-10 text-2xl font-semibold group-hover:text-white transition-colors duration-300">
                  {course.code}
                </div>
                <div className="relative z-10 text-sm group-hover:text-neutral-300 transition-colors duration-300">
                  {course.classes} classes
                </div>
                <div className="relative z-10 text-xs group-hover:text-neutral-400 transition-colors duration-300">
                  Last updated: {course.lastUpdated}
                </div>
                {/* Arrow */}
                <span className="absolute bottom-4 right-4 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-white">
                  →
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
