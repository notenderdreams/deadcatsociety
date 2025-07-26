"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { useParams, useRouter } from "next/navigation"; // Add useParams

const courses = [
  {
    code: "CSE 4102",
    classes: 12,
    lastUpdated: "July 20, 2025",
  },
  {
    code: "EEE 3101",
    classes: 9,
    lastUpdated: "July 18, 2025",
  },
  {
    code: "MATH 2203",
    classes: 15,
    lastUpdated: "July 19, 2025",
  },
  {
    code: "CSE 4201",
    classes: 10,
    lastUpdated: "July 16, 2025",
  },
  {
    code: "HUM 2101",
    classes: 7,
    lastUpdated: "July 15, 2025",
  },
  {
    code: "CSE 4305",
    classes: 14,
    lastUpdated: "July 14, 2025",
  },
];

export default function SemesterGrid() {
  const router = useRouter();
  const params = useParams(); // Get URL params
  const semester = params.semester as string; // Extract semester from params

  // Function to handle navigation
  const handleCourseClick = (courseCode: string) => {
    if (!semester) {
      console.error("Semester parameter is missing");
      return;
    }
    
    // Convert course code to URL-friendly format
    const formattedCourseCode = courseCode.replace(/\s+/g, '-');
    router.push(`/notes/${semester}/${formattedCourseCode}`);
  };

  return (
    <div className="min-h-screen">
      <div className="w-full flex justify-center p-24">
        <h1 className="w-full px-64 text-4xl font-semibold font-serif tracking-tight">
          Summer 2025
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center px-4">
        <div className="grid grid-cols-3 border-t border-l border-neutral-300 max-w-6xl w-full">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="relative border-b border-r border-neutral-300 p-8 h-64 flex flex-col justify-between cursor-pointer group overflow-hidden transition-colors duration-300 hover:bg-neutral-900"
              onClick={() => handleCourseClick(course.code)}
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
          ))}
        </div>
      </div>
    </div>
  );
}
