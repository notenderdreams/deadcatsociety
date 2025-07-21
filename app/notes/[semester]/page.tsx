"use client";

import React from "react";

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
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-10 text-center">Summer 2025</h1>

      {/* Grid */}
      <div className="grid grid-cols-3 border-t border-l border-neutral-300 max-w-5xl w-full">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="relative border-b border-r border-neutral-300 p-8 h-56 flex flex-col justify-between transition-all duration-300 hover:bg-black hover:text-white cursor-pointer group"
          >
            <div className="text-2xl font-semibold">{course.code}</div>
            <div className="text-sm">{course.classes} classes</div>
            <div className="text-xs">Last updated: {course.lastUpdated}</div>

            {/* Arrow on hover */}
            <span className="absolute bottom-4 right-4 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
