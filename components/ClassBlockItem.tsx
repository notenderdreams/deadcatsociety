"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface ClassBlock {
  id: string;
  className: string;
  date: string;
  topics: string[];
}

interface ClassBlockItemProps {
  log: ClassBlock;
  onClick: () => void;
}

export function ClassBlockItem({ log, onClick }: ClassBlockItemProps) {
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

export type { ClassBlock, ClassBlockItemProps };