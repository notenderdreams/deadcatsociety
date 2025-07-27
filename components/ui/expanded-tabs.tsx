"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Tab {
  title: string;
  icon: LucideIcon;
  route: string;
}

interface ExpandedTabsProps {
  tabs: Tab[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
}

const buttonVariants = {
  initial: {
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
  animate: {
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
};

const transition = {
  delay: 0.1,
  type: "spring" as const,
  bounce: 0,
  duration: 0.3,
};

export function ExpandedTabs({
  tabs,
  className,
  onChange,
}: ExpandedTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const selected = React.useMemo(() => {
    const sortedTabs = [...tabs].sort(
      (a, b) => b.route.length - a.route.length
    );
    const matchedTab = sortedTabs.find((tab) => pathname.startsWith(tab.route));
    return matchedTab
      ? tabs.findIndex((tab) => tab.route === matchedTab.route)
      : -1;
  }, [pathname, tabs]);

  const handleSelect = (index: number) => {
    onChange?.(index);
    router.push(tabs[index].route);
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl border-neutral-200 border-2 bg-[#1e1e1e] p-1 shadow-xl relative bg-opacity-10 backdrop-blur-md",
        className
      )}
    >
      {selected !== -1 && buttonRefs.current[selected] && (
        <motion.div
          className="absolute rounded-xl bg-white border-zinc-200 border-2 z-0"
          layoutId="active-tab"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          style={{
            width: buttonRefs.current[selected]?.offsetWidth || "auto",
            height: buttonRefs.current[selected]?.offsetHeight || "auto",
            left: buttonRefs.current[selected]?.offsetLeft || 0,
            top: buttonRefs.current[selected]?.offsetTop || 0,
          }}
        />
      )}

      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isSelected = selected === index;

        return (
          <motion.button
            key={tab.title}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={isSelected}
            onClick={() => handleSelect(index)}
            transition={transition}
            className={cn(
              "relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors duration-300 z-10",
              isSelected
                ? "text-[#808080] font-bold"
                : "text-[#A0A0A0] hover:bg-zinc-500/50 hover:text-white font-medium"
            )}
          >
            <Icon size={20} color={isSelected ? "#808080" : "#A0A0A0"} />
            <span className="overflow-hidden">{tab.title}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
