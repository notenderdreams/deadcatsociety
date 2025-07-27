"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Download, Pencil } from "lucide-react";
import { Button } from "@heroui/react";
import ClassNavPanel from "@/components/ClassNavPanel";
import { useDatabaseStore } from "@/lib/store/useDatabaseStore";
import {
  DatabaseClass,
  DatabaseCourse,
  DatabaseSemester,
} from "@/types/models";

interface ClassDetailData {
  semesterName: string;
  courseCode: string;
  courseName: string;
  classTitle: string;
  description: string;
  topics: string[];
  notesFile?: { name: string; url: string };
  references: string[];
  contributors: string[];
  lastUpdated: string;
}

export default function ClassDetailPage() {
  const params = useParams();
  const classParam = params.class as string;

  const { getClassById } = useDatabaseStore();

  const classData: DatabaseClass  = useMemo(() => {
    if (!classParam) return null;
    return getClassById(classParam);
  }, [classParam, getClassById]);

  const pageData: ClassDetailData | null = useMemo(() => {
    if (!classData) return null;

    const { getCourseById, getSemesterById } = useDatabaseStore.getState();

    const course: DatabaseCourse | undefined = getCourseById(
      classData.course_id
    );
    if (!course) return null;

    const semester: DatabaseSemester | undefined = getSemesterById(
      course.semester_id
    );
    if (!semester) return null;

    const notesFile =
      classData.notes && classData.notes.length > 0
        ? (() => {
            const raw = classData.notes[0];
            const [name, url] = raw.includes("::")
              ? raw.split("::")
              : [`Notes for ${classData.title}`, raw];
            return { name, url };
          })()
        : undefined;

    return {
      semesterName: semester.name,
      courseCode: course.id,
      courseName: course.name,
      classTitle: classData.title,
      description: classData.description,
      topics: classData.topics || [],
      notesFile,
      references: classData.references || [],
      contributors: classData.contributors || [],
      lastUpdated: new Date(classData.updated_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };
  }, [classData]);

  if (!pageData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Class data not found.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/5 ml-24">
        <ClassNavPanel />
      </div>

      {/* Main Content */}
      <div className="w-4/5 bg-neutral-100 px-4 py-10 flex flex-col items-center">
        {/* Top Bar */}
        <div className="flex justify-between items-center w-full max-w-5xl mb-6">
          <nav className="text-sm text-neutral-500">
            {pageData.semesterName} / {pageData.courseCode} /{" "}
            <span className="text-black font-medium">
              {pageData.classTitle}
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
            {pageData.classTitle}
          </div>

          {/* Description */}
          <div className="border-b border-r border-neutral-300 p-6 col-span-2">
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <p className="text-sm text-neutral-700">{pageData.description}</p>
          </div>

          {/* Last Updated */}
          <div className="border-b border-r border-neutral-300 p-6">
            <h2 className="font-semibold text-lg mb-2">Last Updated</h2>
            <p className="text-sm text-neutral-500">{pageData.lastUpdated}</p>
          </div>

          {/* Topics */}
          <div className="border-b border-r border-neutral-300 p-6 col-span-3">
            <h2 className="font-semibold text-lg mb-2">Topics Covered</h2>
            {pageData.topics.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
                {pageData.topics.map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500 italic">
                No topics listed.
              </p>
            )}
          </div>

          {/* Notes */}
          {pageData.notesFile && (
            <div className="border-b border-r border-neutral-300 p-6 col-span-2">
              <h2 className="font-semibold text-lg mb-2">Notes</h2>
              <a
                href={pageData.notesFile.url}
                download
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-neutral-800 transition text-sm"
              >
                <Download size={16} />
                {pageData.notesFile.name}
              </a>
            </div>
          )}

          {/* Contributors */}
          <div className="border-b border-r border-neutral-300 p-6">
            <h2 className="font-semibold text-lg mb-2">Contributors</h2>
            <ul className="flex flex-wrap gap-2 text-sm text-neutral-700">
              {pageData.contributors.map((name, idx) => (
                <li key={idx} className="bg-neutral-100 px-3 py-1 rounded-full">
                  {name}
                </li>
              ))}
            </ul>
          </div>

          {/* References */}
          <div className="border-b border-r border-neutral-300 p-6 col-span-3">
            <h2 className="font-semibold text-lg mb-2">References</h2>
            {pageData.references.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
                {pageData.references.map((ref, idx) => (
                  <li key={idx}>
                    {ref.startsWith("http") ? (
                      <a
                        href={ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {ref}
                      </a>
                    ) : (
                      ref
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500 italic">
                No references provided.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
