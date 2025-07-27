// notes/[semester]/[course]/page.tsx
"use client";

import { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import { useDatabaseStore } from "@/lib/store/useDatabaseStore";
import { ClassBlockItem, type ClassBlock } from "@/components/ClassBlockItem";

export default function App() {
  const router = useRouter();
  const params = useParams();
  const semesterParam = params.semester as string;
  const courseParam = params.course as string;

  const { getSemesterById, getCourseById } = useDatabaseStore();

  const semesterData = useMemo(() => {
    const id = parseInt(semesterParam, 10);
    if (!isNaN(id)) {
      return getSemesterById(id);
    }
    return undefined;
  }, [semesterParam, getSemesterById]);

  const courseData = useMemo(() => {
    if (!semesterData || !courseParam) return undefined;

    const foundCourse = semesterData.courses?.find((c) => c.id === courseParam);

    if (foundCourse) {
      return foundCourse;
    }
    return getCourseById(courseParam);
  }, [semesterData, courseParam, getCourseById]);

  const classBlocks: ClassBlock[] = useMemo(() => {
    if (!courseData) return [];
    return courseData.classes?.map((cls) => ({
      id: cls.id,
      className: cls.title,
      date: new Date(cls.updated_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      topics: cls.topics || [],
    }));
  }, [courseData]);

  const handleClassClick = (classId: string) => {
    if (!semesterParam || !courseParam) {
      console.error("Semester or Course parameter is missing for navigation");
      return;
    }
    router.push(`/notes/${semesterParam}/${courseParam}/${classId}`);
  };

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Course not found. (Semester ID: {semesterParam}, Course ID/Param:{" "}
        {courseParam})
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="px-96 py-16 flex justify-between">
        <h1 className="text-4xl font-serif">{courseData.name}</h1>
        <Button className="bg-black text-white ">
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
    </div>
  );
}
