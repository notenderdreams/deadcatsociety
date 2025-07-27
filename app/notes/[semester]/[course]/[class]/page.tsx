// notes/[semester]/[course]/[class]/page.tsx
"use client";

import { useMemo } from "react"; // Add useMemo
import { useParams } from "next/navigation"; // Add useParams
import { Download, Pencil } from "lucide-react";
import { Button } from "@heroui/react";
import ClassNavPanel from "@/components/ClassNavPanel";
import { useDatabaseStore } from "@/lib/store/useDatabaseStore"; // Import store

// Define the type for the data you'll pass to the component
interface ClassDetailData {
  semesterName: string; // Or ID if preferred
  courseCode: string;
  courseName: string;
  classTitle: string;
  description: string;
  topics: string[];
  notesFile?: { name: string; url: string }; // Optional
  references: string[];
  contributors: string[];
  lastUpdated: string;
  // Add other fields as needed
}

export default function ClassDetailPage() {
  const params = useParams();
  // const semesterParam = params.semester as string; // Not strictly needed if getting from data
  // const courseParam = params.course as string;    // Not strictly needed if getting from data
  const classParam = params.class as string;

  // --- Zustand Integration ---
  const { getClassById } = useDatabaseStore();

  // Find the specific class data using the class ID from the URL
  const classData = useMemo(() => {
    if (!classParam) return null;
    return getClassById(classParam);
  }, [classParam, getClassById]);

  // Derive the structured data for the page from the raw class data and related course/semester
  const pageData: ClassDetailData | null = useMemo(() => {
    if (!classData) return null;

    const { getCourseById } = useDatabaseStore.getState(); // Get helper (non-reactive access within useMemo is fine)
    const course = getCourseById(classData.course_id);
    if (!course) return null;

    const { getSemesterById } = useDatabaseStore.getState();
    const semester = getSemesterById(course.semester_id);
    if (!semester) return null;

    return {
      semesterName: semester.name,
      courseCode: course.code,
      courseName: course.name,
      classTitle: classData.title,
      description: classData.content, // Assuming 'content' holds the description text/URL
      topics: classData.topics || [],
      // Handle notes file - assuming the first note link is the main one, or handle differently
      notesFile:
        classData.notes && classData.notes.length > 0
          ? { name: `Notes for ${classData.title}`, url: classData.notes[0] }
          : undefined,
      references: classData.resources || [], // Map 'resources' to 'references'
      contributors: [classData.uploaded_by], // Wrap single contributor in array, or handle array if data changes
      lastUpdated: new Date(
        classData.updated_at || classData.created_at
      ).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };
  }, [classData]);
  // --- End Zustand Integration ---

  if (!pageData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Class data not found.
      </div>
    );
  }

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
          {/* Note: If content is a URL, you might want to fetch and render it, or link to it */}
          <div className="border-b border-r border-neutral-300 p-6 col-span-2">
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            {/* Simple display - consider markdown rendering or iframe for URLs */}
            <p className="text-sm text-neutral-700">{pageData.description}</p>
            {/* Example for linking if it's a URL:
            {pageData.description.startsWith('http') ? (
              <a href={pageData.description} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                View Full Content
              </a>
            ) : (
              <p className="text-sm text-neutral-700">{pageData.description}</p>
            )}
            */}
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
          {/* Conditional rendering if notesFile exists */}
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
                  // Consider making these links if they are URLs
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
