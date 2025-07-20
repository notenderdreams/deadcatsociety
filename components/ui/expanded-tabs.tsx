import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useOnClickOutside } from "usehooks-ts";
import { cn } from "@/lib/utils";

interface Tab {
  title: string;
  icon: LucideIcon;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
}

type TabItem = Tab | Separator;

interface ExpandedTabsProps {
  tabs: TabItem[];
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
  activeColor = "text-primary",
  onChange,
}: ExpandedTabsProps) {
  const [selected, setSelected] = React.useState<number | null>(null);
  const outsideClickRef = React.useRef<HTMLDivElement>(
    null as unknown as HTMLDivElement
  );
  const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  useOnClickOutside(outsideClickRef, () => {
    setSelected(null);
    onChange?.(null);
  });

  const handleSelect = (index: number) => {
    setSelected(index);
    onChange?.(index);
  };

  const Separator = () => (
    <div
      className="mx-1 h-[24px] w-[1.2px] bg-muted-foreground"
      aria-hidden="true"
    />
  );

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl border-neutral-200 border-2 bg-[#1e1e1e] p-1 shadow-xl relative bg-opacity-10 backdrop-blur-md",
        className
      )}
    >
      {selected !== null && buttonRefs.current[selected] && (
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
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

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
                : "text-[#A0A0A0] hover:bg-zinc-700/50 hover:text-white font-medium"
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
