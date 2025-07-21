"use client";
import { useRef } from "react";
export default function App() {
  const studyLogs = [
    {
      className: "Speculative Realities",
      date: "Nov 15, 2024",
      topics: [
        "Sci-fi Labour exhibition in Beta  ",
        "Lost Memory  ",
        "Dune Spice  ",
        "Ghost in the Shell  ",
        "Blade Runner Nexus  ",
      ],
    },
    {
      className: "Chilton Database",
      date: "Oct 28, 2024",
      topics: [
        "Terell Sprout  ",
        "Frank Gehry  ",
        "Dr. Zachariah Spergmann  ",
        "And Goldstone  ",
        "Lost Archives  ",
        "Art Therapy  ",
      ],
    },
    {
      className: "Charles Cockrell",
      date: "Oct 14, 2024",
      topics: [
        "Character-Conscious Essays  ",
        "Tangere Heritage  ",
        "New Wave Science Fiction  ",
        "Geraldo Sarribe  ",
      ],
    },
    {
      className: "Ironia Airolica",
      date: "Sep 30, 2024",
      topics: [
        "Kappersville Laboratory  ",
        "S.N. Mazuzo  ",
        "Transactivist Memoir  ",
        "Z CORE  ",
        "Hybrid Archeologies  ",
        "Roboto Chin  ",
      ],
    },
    {
      className: "Jean Park",
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
        {studyLogs.map((log, index) => (
          <div
            key={index}
            className="group relative transition-colors duration-300 border-t border-[#3d3d3d] bg-white hover:bg-black hover:text-white"
          >
            {/* Right Arrow on Hover */}
            <div className="absolute top-1/2 right-4 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-2xl">
              →
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 py-6">
              {/* Class Info */}
              <div className="space-y-2">
                <h2 className="font-medium text-base">{log.className}</h2>
                <div className="text-sm opacity-70">{log.date}</div>
              </div>

              {/* Topics */}
              <div className="space-y-1">
                {log.topics.length > 0 ? (
                  log.topics.map((topic: string, topicIndex: number) => (
                    <div key={topicIndex} className="flex items-start">
                      <span className="text-sm mr-2 mt-0.5 font-mono min-w-[20px]">
                        {topicIndex + 1}.
                      </span>
                      <span className="text-sm leading-relaxed">{topic}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm opacity-50 italic">
                    No topics recorded
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="h-16" />
      </div>
    </div>
  );
}
