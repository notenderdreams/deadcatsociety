// notes/[semester]/[course]/page.tsx
"use client";

import { useRef, useState, useMemo } from "react"; // Add useMemo
import { useRouter, useParams } from "next/navigation"; // Add useParams
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { PlusIcon } from "lucide-react";
import { useDatabaseStore } from "@/lib/store/useDatabaseStore"; // Import store

interface StudyLog {
  id: string;
  className: string;
  // courseCode: string; // Might not be needed if we get it from context
  // semester: string; // Might not be needed if we get it from context
  date: string;
  topics: string[];
}

export default function App() {
  const router = useRouter();
  const params = useParams();
  const semesterParam = params.semester as string;
  const courseParam = params.course as string;

  // --- Zustand Integration ---
  const { getSemesterById, getCourseByCode } = useDatabaseStore();

  // Find the semester object
  const semesterData = useMemo(() => {
    const id = parseInt(semesterParam, 10);
    if (!isNaN(id)) {
      return getSemesterById(id);
    }
    // Add logic for name lookup if needed, similar to above
    return undefined;
  }, [semesterParam, getSemesterById]);

  // Find the specific course within that semester
  // We need to find the course by its *code* which matches the URL param
  const courseData = useMemo(() => {
    if (!semesterData || !courseParam) return undefined;
    // The URL param is likely "CSE-4301", convert back to "CSE4301" to match data
    const formattedCourseCode = courseParam.replace(/-/g, " ");
    return semesterData.courses.find((c) => c.code === formattedCourseCode);
  }, [semesterData, courseParam]);

  // Derive study logs (classes) from the course data
  const studyLogs: StudyLog[] = useMemo(() => {
    if (!courseData) return [];
    return courseData.classes.map((cls) => ({
      id: cls.id,
      className: cls.title,
      // courseCode and semester can be derived from context/route if needed, or passed down
      // For simplicity, we can pass them or get them from the URL/context
      // date: new Date(cls.created_at).toLocaleDateString('en-US', options),
      date: new Date(cls.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      topics: cls.topics || [], // Ensure topics is an array
    }));
  }, [courseData]);
  // --- End Zustand Integration ---

  // Handle navigation to a specific class detail page
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
        Course not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="px-96 py-16 flex justify-between">
        <h1 className="text-4xl font-serif">
          {courseData.name} ({courseData.code})
        </h1>{" "}
        {/* Use name and code from data */}
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
        {studyLogs.length > 0 ? (
          studyLogs.map((log) => (
            <StudyLogItem
              key={log.id}
              log={log}
              onClick={() => handleClassClick(log.id)} // Pass the class ID
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

// --- StudyLogItem remains mostly the same, just ensure it uses the correct props ---
interface StudyLogItemProps {
  log: StudyLog;
  onClick: () => void;
}

function StudyLogItem({ log, onClick }: StudyLogItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const findClosestEdge = (
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ): "top" | "bottom" => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  const distMetric = (x: number, y: number, x2: number, y2: number): number => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  const handleMouseEnter = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current || !overlayRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);
    overlayRef.current.style.transform = `translate3d(0, ${
      edge === "top" ? "-100%" : "100%"
    }, 0)`;
    requestAnimationFrame(() => {
      if (overlayRef.current) {
        overlayRef.current.style.transform = "translate3d(0, 0%, 0)";
        setIsHovered(true);
      }
    });
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current || !overlayRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);
    overlayRef.current.style.transform = `translate3d(0, ${
      edge === "top" ? "-100%" : "100%"
    }, 0)`;
    setIsHovered(false);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      ref={itemRef}
      className="group relative overflow-hidden border-t border-[#3d3d3d] bg-white cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Background Color Overlay */}
      <div
        ref={overlayRef}
        className="absolute top-0 left-0 w-full h-full bg-black pointer-events-none z-0"
        style={{
          transform: "translate3d(0, 100%, 0)",
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      {/* Right Arrow on Hover */}
      <div
        className={`absolute top-1/2 right-4 -translate-y-1/2 text-white transition-all duration-300 text-2xl z-20
          ${isHovered ? "opacity-100 translate-x-1" : "opacity-0"}
        `}
      >
        →
      </div>
      {/* Content - changes color only when isHovered */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-6 relative z-10 transition-colors duration-300 ${
          isHovered ? "text-white" : "text-black"
        }`}
      >
        {/* Class Info */}
        <div className="space-y-2 text-left">
          <h2 className="font-medium text-base">{log.className}</h2>
          <div className="text-sm opacity-70">{log.date}</div>
        </div>
        {/* Topics */}
        <div className="space-y-1 text-left">
          {log.topics.length > 0 ? (
            log.topics.map((topic, topicIndex) => (
              <div key={topicIndex} className="flex items-start">
                <span className="text-sm mr-2 mt-0.5 font-mono min-w-[20px]">
                  {topicIndex + 1}.
                </span>
                <span className="text-sm leading-relaxed">{topic}</span>
              </div>
            ))
          ) : (
            <div className="text-sm opacity-50 italic">No topics recorded</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
