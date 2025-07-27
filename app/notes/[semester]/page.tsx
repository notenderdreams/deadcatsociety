// notes/[semester]/page.tsx
"use client";
import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { useParams, useRouter } from "next/navigation";
import { useDatabaseStore } from "@/lib/store/useDatabaseStore"; // Ensure path is correct

export default function SemesterGrid() {
  const router = useRouter();
  const params = useParams();
  const semesterParam = params.semester as string;

  const { getSemesterById, getActiveSemester } = useDatabaseStore();

  const semesterData = useMemo(() => {
    if (semesterParam) {
      const id = parseInt(semesterParam, 10);
      if (!isNaN(id)) {
        return getSemesterById(id);
      } else {
        // Fallback: Find by name (slugified), if needed
        return useDatabaseStore
          .getState()
          .data.semesters.find(
            (s) =>
              s.name.replace(/\s+/g, "-").toLowerCase() ===
              semesterParam.toLowerCase()
          );
      }
    }
    return getActiveSemester();
  }, [semesterParam, getSemesterById, getActiveSemester]);

  // Derive course data for display, using properties that exist
  const courses = useMemo(() => {
    return (
      semesterData?.courses.map((course) => ({
        id: course.id,
        name: course.name, // Use 'name' for display
        // code: course.code, // Removed - 'code' doesn't exist in mockData.ts MockCourse
        classes: course.classes.length,
        lastUpdated: new Date(course.updated_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      })) || []
    );
  }, [semesterData]);

  // --- FIXED: Correctly formatted handleCourseClick using course.id ---
  const handleCourseClick = (courseId: string) => {
    if (!semesterData?.id) {
      console.error("Semester data or ID is missing");
      return;
    }

    // Find the course object to get its ID (which we already have) or other details if needed
    // const course = semesterData.courses.find((c) => c.id === courseId);
    // if (course) {
    // Navigate using the course ID directly
    // The [course] page will need to find the course by this ID
    router.push(`/notes/${semesterData.id}/${courseId}`);
    // }
    // Simplified: We already have courseId, no need to re-find it just to get the same ID
    // router.push(`/notes/${semesterData.id}/${courseId}`);
  };
  // --- End FIXED handleCourseClick ---

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
          {semesterData.name}
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center px-4">
        <div className="grid grid-cols-3 border-t border-l border-neutral-300 max-w-6xl w-full">
          {courses.map((course) => (
            <div
              key={course.id}
              className="relative border-b border-r border-neutral-300 p-8 h-64 flex flex-col justify-between cursor-pointer group overflow-hidden transition-colors duration-300 hover:bg-neutral-900"
              onClick={() => handleCourseClick(course.id)} // Pass course ID
            >
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
              {/* --- FIXED: Display course.name instead of non-existent course.code --- */}
              <div className="relative z-10 text-2xl font-semibold group-hover:text-white transition-colors duration-300">
                {course.name} {/* Display the course name */}
              </div>
              <div className="relative z-10 text-sm group-hover:text-neutral-300 transition-colors duration-300">
                {course.classes} classes
              </div>
              <div className="relative z-10 text-xs group-hover:text-neutral-400 transition-colors duration-300">
                Last updated: {course.lastUpdated}
              </div>
              <span className="absolute bottom-4 right-4 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-white">
                →
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
