"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Download, Pencil, ArrowLeft } from "lucide-react";
import { Button } from "@heroui/react";
import ClassModal from "@/components/ClassModal";
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

interface EditFormData {
  title: string;
  description: string;
  topics: string[];
  notes: string;
  references: string[];
  contributors: string[];
}

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const classParam = params.class as string;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getClassById, isInitialized, updateClass, data } = useDatabaseStore();

  const classData: DatabaseClass | null = useMemo(() => {
    if (!classParam || !isInitialized) return null;
    const data = getClassById(classParam);
    return data ? data : null;
  }, [classParam, isInitialized, getClassById, data]); // Added data dependency

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

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (formData: EditFormData) => {
    if (!classData || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const updatedClassPayload = {
        title: formData.title,
        description: formData.description,
        topics: formData.topics,
        notes: formData.notes ? [formData.notes] : [],
        references: formData.references,
        contributors: formData.contributors,
        updated_at: new Date().toISOString(),
      };

      const response = await fetch(`/api/class/${classData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedClassPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update class: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.updated) {
        // Update the local state using the store method
        updateClass(classData.id, result.updated);
        setIsEditModalOpen(false);

        // Show success message
        console.log("Class updated successfully!");
      } else {
        throw new Error("Failed to get updated class data");
      }
    } catch (error) {
      console.error("Failed to update class:", error);
      alert("Failed to update class. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitialFormData = (): EditFormData | undefined => {
    if (!classData) return undefined;

    return {
      title: classData.title,
      description: classData.description,
      topics: classData.topics || [],
      notes: classData.notes?.[0] || "",
      references: classData.references || [],
      contributors: classData.contributors || [],
    };
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading class data...
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Class data not found.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-screen  justify-center">
      {/* Main Content */}
      <div
        className={`bg-neutral-100 px-4 py-10 flex flex-col items-center w-full transition-all duration-300 ${
          isEditModalOpen ? "blur-sm" : ""
        }`}
      >
        {/* Top Bar */}
        <motion.div
          className="flex justify-between items-center w-full max-w-5xl mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <Button
              className="inline-flex items-center gap-1 text-sm px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-100 transition"
              onClick={() => router.back()}
            >
              <ArrowLeft size={14} />
              Back
            </Button>
            <nav className="text-sm text-neutral-500">
              {pageData.semesterName} / {pageData.courseCode} /{" "}
              <span className="text-black font-medium">
                {pageData.classTitle}
              </span>
            </nav>
          </div>
          <Button
            className="inline-flex items-center gap-1 text-sm px-3 py-1 border border-neutral-300 rounded hover:bg-neutral-100 transition"
            onClick={handleEditClick}
            disabled={isSubmitting}
          >
            <Pencil size={14} />
            Edit
          </Button>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          className="grid grid-cols-3 border-t border-l border-neutral-300 max-w-5xl w-full"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {/* Title */}
          <motion.div
            className="border-b border-r border-neutral-300 p-6 h-48 flex items-center justify-center text-2xl font-bold col-span-3"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
            {pageData.classTitle}
          </motion.div>

          {/* Description */}
          <motion.div
            className="border-b border-r border-neutral-300 p-6 col-span-2"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <p className="text-sm text-neutral-700">{pageData.description}</p>
          </motion.div>

          {/* Last Updated */}
          <motion.div
            className="border-b border-r border-neutral-300 p-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-semibold text-lg mb-2">Last Updated</h2>
            <p className="text-sm text-neutral-500">{pageData.lastUpdated}</p>
          </motion.div>

          {/* Topics */}
          <motion.div
            className="border-b border-r border-neutral-300 p-6 col-span-3"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>

          {/* Notes */}
          {pageData.notesFile && (
            <motion.div
              className="border-b border-r border-neutral-300 p-6 col-span-2"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-semibold text-lg mb-2">Notes</h2>
              <a
                href={pageData.notesFile.url}
                download
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-neutral-800 transition text-sm"
              >
                <Download size={16} />
                {pageData.notesFile.name}
              </a>
            </motion.div>
          )}

          {/* Contributors */}
          <motion.div
            className="border-b border-r border-neutral-300 p-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-semibold text-lg mb-2">Contributors</h2>
            <ul className="flex flex-wrap gap-2 text-sm text-neutral-700">
              {pageData.contributors.map((name, idx) => (
                <li key={idx} className="bg-neutral-100 px-3 py-1 rounded-full">
                  {name}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* References */}
          <motion.div
            className="border-b border-r border-neutral-300 p-6 col-span-3"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <ClassModal
        isOpen={isEditModalOpen}
        onClose={() => !isSubmitting && setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        isEdit={true}
        initialData={getInitialFormData()}
        disabled={isSubmitting}
      />
    </div>
  );
}
