"use client";
import { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import { useDatabaseStore } from "@/lib/store/useDatabaseStore";
import { ClassBlockItem, type ClassBlock } from "@/components/ClassBlockItem";
import ClassModal from "@/components/ClassModal";

interface EditFormData {
  title: string;
  description: string;
  topics: string[];
  notes: string;
  references: string[];
  contributors: string[];
}

export default function App() {
  const router = useRouter();
  const params = useParams();
  const semesterParam = params.semester as string;
  const courseParam = params.course as string;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isInitialized,
    getSemesterById,
    getCourseById,
    addClassToCourse,
    data,
  } = useDatabaseStore();

  const semesterData = useMemo(() => {
    if (!isInitialized) return undefined;
    const id = parseInt(semesterParam, 10);
    if (!isNaN(id)) {
      return getSemesterById(id);
    }
    return undefined;
  }, [isInitialized, semesterParam, getSemesterById, data]); // Added data dependency

  const courseData = useMemo(() => {
    if (!isInitialized || !semesterData || !courseParam) return undefined;
    const foundCourse = semesterData.courses?.find((c) => c.id === courseParam);
    return foundCourse || getCourseById(courseParam);
  }, [isInitialized, semesterData, courseParam, getCourseById, data]); // Added data dependency

  const classBlocks: ClassBlock[] = useMemo(() => {
    if (!courseData) return [];
    return [...(courseData.classes || [])] // create a shallow copy
      .reverse() // reverse to show newest first
      .map((cls) => ({
        id: cls.id,
        className: cls.title,
        date: new Date(cls.updated_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        topics: cls.topics || [],
      }));
  }, [courseData, data]);

  const handleClassClick = (classId: string) => {
    if (!semesterParam || !courseParam) return;
    router.push(`/notes/${semesterParam}/${courseParam}/${classId}`);
  };

  const handleAddClass = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNewClass = async (formData: EditFormData) => {
    if (!courseParam || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const newClassPayload = {
        course_id: courseParam,
        title: formData.title,
        description: formData.description,
        topics: formData.topics,
        notes: formData.notes ? [formData.notes] : [],
        references: formData.references,
        contributors: formData.contributors,
        updated_at: new Date().toISOString(),
      };

      const response = await fetch("/api/class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClassPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to create class: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.class) {
        // Use the returned class data with actual ID from database
        addClassToCourse(courseParam, result.class);
        setIsAddModalOpen(false);

        // Show success message
        console.log("Class created successfully with ID:", result.class.id);
      } else {
        throw new Error("Failed to get created class data");
      }
    } catch (error) {
      console.error("Failed to create class:", error);
      // You might want to show an error toast here
      alert("Failed to create class. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading course data...
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Course not found. (Semester ID: {semesterParam}, Course ID:{" "}
        {courseParam})
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen text-black transition-all duration-300 ${
        isAddModalOpen ? "blur-sm" : ""
      }`}
    >
      <div className="px-96 py-16 flex justify-between">
        <h1 className="text-4xl font-serif">{courseData.name}</h1>
        <Button
          className="bg-black text-white"
          onClick={handleAddClass}
          disabled={isSubmitting}
        >
          <PlusIcon size={16} />
          New Class
        </Button>
      </div>

      <motion.div
        className="max-w-6xl mx-auto px-8 pb-16"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {classBlocks.length > 0 ? (
          classBlocks.map((block) => (
            <ClassBlockItem
              key={block.id}
              log={block}
              onClick={() => handleClassClick(block.id)}
            />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No classes found for this course yet.
          </div>
        )}
        <div className="h-16" />
      </motion.div>

      {/* Add Class Modal */}
      <ClassModal
        isOpen={isAddModalOpen}
        onClose={() => !isSubmitting && setIsAddModalOpen(false)}
        onSave={handleSaveNewClass}
        isEdit={false}
        // disabled={isSubmitting}
      />
    </div>
  );
}
