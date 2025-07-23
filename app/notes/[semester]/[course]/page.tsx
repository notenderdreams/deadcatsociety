"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";

interface StudyLog {
  id: string;
  className: string;
  courseCode: string;
  semester: string;
  date: string;
  topics: string[];
}

export default function App() {
  const router = useRouter();
  const studyLogs: StudyLog[] = [
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      className: "Speculative Realities",
      courseCode: "EEE-3101",
      semester: "1",
      date: "Nov 15, 2024",
      topics: [
        "Sci-fi Labour exhibition in Beta",
        "Lost Memory",
        "Dune Spice",
        "Ghost in the Shell",
        "Blade Runner Nexus",
      ],
    },
    {
      id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      className: "Chilton Database",
      courseCode: "EEE-3102",
      semester: "1",
      date: "Oct 28, 2024",
      topics: [
        "Terell Sprout",
        "Frank Gehry",
        "Dr. Zachariah Spergmann",
        "And Goldstone",
        "Lost Archives",
        "Art Therapy",
      ],
    },
    {
      id: "6ba7b811-9dad-11d1-80b4-00c04fd430c9",
      className: "Charles Cockrell",
      courseCode: "EEE-3103",
      semester: "1",
      date: "Oct 14, 2024",
      topics: [
        "Character-Conscious Essays",
        "Tangere Heritage",
        "New Wave Science Fiction",
        "Geraldo Sarribe",
      ],
    },
    {
      id: "6ba7b812-9dad-11d1-80b4-00c04fd430c0",
      className: "Ironia Airolica",
      courseCode: "EEE-3104",
      semester: "1",
      date: "Sep 30, 2024",
      topics: [
        "Kappersville Laboratory",
        "S.N. Mazuzo",
        "Transactivist Memoir",
        "Z CORE",
        "Hybrid Archeologies",
        "Roboto Chin",
      ],
    },
    {
      id: "6ba7b813-9dad-11d1-80b4-00c04fd430c1",
      className: "Jean Park",
      courseCode: "EEE-3105",
      semester: "1",
      date: "Sep 22, 2024",
      topics: [],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold">Classes</h1>
      </div>

      <div className="max-w-6xl mx-auto px-8 pb-16">
        {studyLogs.map((log) => (
          <StudyLogItem
            key={log.id}
            log={log}
            onClick={() =>
              router.push(`/notes/${log.semester}/${log.courseCode}/${log.id}`)
            }
          />
        ))}
        <div className="h-16" />
      </div>
    </div>
  );
}

interface StudyLogItemProps {
  log: StudyLog;
  onClick: () => void;
}

function StudyLogItem({ log, onClick }: StudyLogItemProps) {
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
  };

  return (
    <div
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
      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-2xl z-20">
        →
      </div>

      {/* Content - changes color when overlay is visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-6 relative z-10 group-hover:text-white transition-colors duration-300">
        {/* Class Info */}
        <div className="space-y-2">
          <h2 className="font-medium text-base">{log.className}</h2>
          <div className="text-sm opacity-70">{log.date}</div>
          <div className="text-xs opacity-50">{log.courseCode}</div>
        </div>

        {/* Topics */}
        <div className="space-y-1">
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
    </div>
  );
}
