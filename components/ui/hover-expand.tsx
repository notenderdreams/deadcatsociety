"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Semester {
  id: number;
  name: string;
  subtitle: string;
  image: string;
}

interface HoverExpandProps {
  semesters: Semester[];
  initialSelectedIndex?: number;
}

export default function HoverExpand({
  semesters,
  initialSelectedIndex = 0,
}: HoverExpandProps) {
  const [selectedIndex, setSelectedIndex] =
    useState<number>(initialSelectedIndex);
  const router = useRouter();
  const maxThumbnails = 8;
  const thumbnailHeight = 500;
  return (
    <div className="relative">
      <div className="mx-auto flex w-fit gap-1 rounded-md pb-6 pt-10 md:gap-2">
        {semesters.slice(0, maxThumbnails).map((semester, i) => (
          <div
            key={`semester-${semester.id}`}
            className={`group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer ${
              selectedIndex === i ? "w-64" : "w-4 sm:w-5 md:w-8 xl:w-24"
            }`}
            style={{ height: `${thumbnailHeight}px` }}
            onMouseEnter={() => setSelectedIndex(i)}
            onClick={() => router.push(`/notes/${semester.id}`)}
          >
            <motion.div
              layoutId={`image-${i}`}
              className="absolute inset-0 h-full w-full"
            >
              <img
                src={semester.image}
                alt={semester.name}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        ))}
      </div>

      {/* Semester Text Below */}
      <div className="text-center mt-4 h-20">
        <motion.div
          key={semesters[selectedIndex].id}
          initial={{ opacity: 0, y: -10, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold">
            {semesters[selectedIndex].name}
          </h2>
          <p className="text-lg text-gray-600">
            {semesters[selectedIndex].subtitle}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
