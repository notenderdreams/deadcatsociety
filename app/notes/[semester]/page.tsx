"use client";
import React, { useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { useParams, useRouter } from "next/navigation";
import { useDatabaseStore } from "@/lib/store/useDatabaseStore";

export default function SemesterGrid() {
  const router = useRouter();
  const params = useParams();
  const semesterParam = params.semester as string;
  const containerRef = useRef<HTMLDivElement>(null);

  const { getSemesterById, getActiveSemester } = useDatabaseStore();

  const semesterData = useMemo(() => {
    if (semesterParam) {
      const id = parseInt(semesterParam, 10);
      if (!isNaN(id)) {
        return getSemesterById(id);
      } else {
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

  const courses = useMemo(() => {
    return (
      semesterData?.courses?.map((course) => ({
        id: course.id,
        name: course.name,
        classes: course.classes?.length || 0,
        lastUpdated: new Date(course.updated_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      })) || []
    );
  }, [semesterData]);

  useEffect(() => {
    if (containerRef.current) {
      const courseBlocks =
        containerRef.current.querySelectorAll(".course-block");

      // Set initial state for all blocks
      courseBlocks.forEach((block) => {
        (block as HTMLElement).style.opacity = "0";
        (block as HTMLElement).style.filter = "blur(4px)";
        (block as HTMLElement).style.transform = "translateY(20px)";
      });

      // Trigger animation for all blocks simultaneously
      setTimeout(() => {
        courseBlocks.forEach((block) => {
          (block as HTMLElement).style.transition =
            "opacity 0.3s ease-out, transform 0.4s ease-out, filter 0.3s ease-out";
          (block as HTMLElement).style.opacity = "1";
          (block as HTMLElement).style.filter = "blur(0)";
          (block as HTMLElement).style.transform = "translateY(0)";
        });
      }, 10); // Small timeout to ensure initial styles are applied
    }
  }, [courses]);

  const handleCourseClick = (courseId: string) => {
    if (!semesterData?.id) {
      console.error("Semester data or ID is missing");
      return;
    }

    router.push(`/notes/${semesterData.id}/${courseId}`);
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
          {semesterData.name}
        </h1>
      </div>
      <div
        className="flex flex-col justify-center items-center px-4"
        ref={containerRef}
      >
        <div className="grid grid-cols-3 border-t border-l border-neutral-300 max-w-6xl w-full">
          {courses.map((course) => (
            <div
              key={course.id}
              className="course-block relative border-b border-r border-neutral-300 p-8 h-64 flex flex-col justify-between cursor-pointer group overflow-hidden transition-colors duration-300 hover:bg-neutral-900"
              onClick={() => handleCourseClick(course.id)}
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                filter: "blur(4px)",
                transition: "none",
              }}
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
              <div className="relative z-10 text-2xl font-semibold group-hover:text-white transition-colors duration-300">
                {course.name}
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
