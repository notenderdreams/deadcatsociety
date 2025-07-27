"use client";
import { motion, useInView } from "framer-motion";
import HoverExpand from "@/components/ui/hover-expand";
import { useRef } from "react"; 
import {
  useDatabaseStore,
} from "@/lib/store/useDatabaseStore";

export default function SemestersPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const semesters = useDatabaseStore((state) => state.data.semesters);

  return (
    <section className="mx-auto min-w-screen h-screen rounded-[24px] p-2 md:rounded-t-[44px]">
      <article className="relative z-50 mt-20 flex flex-col items-center justify-center">
        <h1 className="max-w-2xl text-center text-6xl font-semibold font-serif tracking-tight">
          Semesters
        </h1>
      </article>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -40, filter: "blur(6px)" }}
        animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <HoverExpand semesters={semesters} />
      </motion.div>
    </section>
  );
}
