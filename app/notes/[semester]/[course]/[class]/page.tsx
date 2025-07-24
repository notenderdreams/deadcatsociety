"use client";

import { Download, Pencil } from "lucide-react";
import { Button } from "@heroui/react";
import ClassNavPanel from "@/components/ClassNavPanel";

const classData = {
  semester: "Semester 1",
  course: "CSE 4142",
  classTitle: "Class 2",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...",
  topics: [
    "FCFS Scheduling",
    "SJF Scheduling",
    "Round Robin",
    "Gantt Charts",
    "Waiting Time",
    "Turnaround Time",
  ],
  notesFile: {
    name: "Class-2-Notes.pdf",
    url: "/notes/Class-2-Notes.pdf",
  },
  references: [
    "Operating System Concepts by Silberschatz",
    "GeeksforGeeks - CPU Scheduling",
  ],
  contributors: ["Ayesha Rahman", "Tariq Hasan"],
  lastUpdated: "July 20, 2025",
};

export default function ClassDetailPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar (1/5) */}
      <div className="w-1/5 ml-24 ">
        <ClassNavPanel />
      </div>

      {/* Main Content (4/5) */}
      <div className="w-4/5 bg-neutral-100 px-4 py-10 flex flex-col items-center">
        {/* Top Bar */}
        <div className="flex justify-between items-center w-full max-w-5xl mb-6">
          <nav className="text-sm text-neutral-500">
            {classData.semester} / {classData.course} /{" "}
            <span className="text-black font-medium">
              {classData.classTitle}
            </span>
          </nav>
          <Button className="inline-flex items-center gap-1 text-sm px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-100 transition">
            <Pencil size={14} />
            Edit
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-3 border-t border-l border-neutral-300 max-w-5xl w-full">
          {/* Title */}
          <div className="border-b border-r border-neutral-300 p-6 h-48 flex items-center justify-center text-2xl font-bold col-span-3">
            {classData.classTitle}
          </div>

          {/* Description */}
          <div className="border-b border-r border-neutral-300 p-6 col-span-2">
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <p className="text-sm text-neutral-700">{classData.description}</p>
          </div>

          {/* Last Updated */}
          <div className="border-b border-r border-neutral-300 p-6">
            <h2 className="font-semibold text-lg mb-2">Last Updated</h2>
            <p className="text-sm text-neutral-500">{classData.lastUpdated}</p>
          </div>

          {/* Topics */}
          <div className="border-b border-r border-neutral-300 p-6 col-span-3">
            <h2 className="font-semibold text-lg mb-2">Topics Covered</h2>
            <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
              {classData.topics.map((topic, idx) => (
                <li key={idx}>{topic}</li>
              ))}
            </ul>
          </div>

          {/* Notes */}
          <div className="border-b border-r border-neutral-300 p-6 col-span-2">
            <h2 className="font-semibold text-lg mb-2">Notes</h2>
            <a
              href={classData.notesFile.url}
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-neutral-800 transition text-sm"
            >
              <Download size={16} />
              {classData.notesFile.name}
            </a>
          </div>

          {/* Contributors */}
          <div className="border-b border-r border-neutral-300 p-6">
            <h2 className="font-semibold text-lg mb-2">Contributors</h2>
            <ul className="flex flex-wrap gap-2 text-sm text-neutral-700">
              {classData.contributors.map((name, idx) => (
                <li key={idx} className="bg-neutral-100 px-3 py-1 rounded-full">
                  {name}
                </li>
              ))}
            </ul>
          </div>

          {/* References */}
          <div className="border-b border-r border-neutral-300 p-6 col-span-3">
            <h2 className="font-semibold text-lg mb-2">References</h2>
            <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
              {classData.references.map((ref, idx) => (
                <li key={idx}>{ref}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
