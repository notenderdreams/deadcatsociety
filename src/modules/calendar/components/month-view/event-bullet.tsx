// File: event-bullet.tsx
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { TEventType } from "@/modules/calendar/types";

const eventBulletVariants = cva("size-2 rounded-full", {
  variants: {
    type: {
      general: "bg-gray-600 dark:bg-gray-500",
      club: "bg-blue-600 dark:bg-blue-500",
      exam: "bg-red-600 dark:bg-red-500",
      deadline: "bg-orange-600 dark:bg-orange-500",
      rescheduled: "bg-purple-600 dark:bg-purple-500",
    },
  },
  defaultVariants: {
    type: "general",
  },
});

export function EventBullet({
  type,
  className,
}: {
  type: TEventType;
  className: string;
}) {
  return <div className={cn(eventBulletVariants({ type, className }))} />;
}
