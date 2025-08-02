"use client";

import { cva } from "class-variance-authority";
import { Text } from "lucide-react";

import { useCalendar } from "@/modules/calendar/contexts/calendar-context";

import { EventDetailsDialog } from "@/modules/calendar/components/dialogs/event-details-dialog";

import type { IEvent } from "@/types/models";
import type { VariantProps } from "class-variance-authority";

const agendaEventCardVariants = cva(
  "flex select-none items-center justify-between gap-3 rounded-md border p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  {
    variants: {
      type: {
        general:
          "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 [&_.event-dot]:fill-gray-600",
        club: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 [&_.event-dot]:fill-blue-600",
        exam: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300 [&_.event-dot]:fill-red-600",
        deadline:
          "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300 [&_.event-dot]:fill-orange-600",
        rescheduled:
          "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300 [&_.event-dot]:fill-purple-600",
      },
    },
    defaultVariants: {
      type: "general",
    },
  }
);

interface IProps {
  event: IEvent;
  eventCurrentDay?: number;
  eventTotalDays?: number;
}

export function AgendaEventCard({ event }: IProps) {
  const { badgeVariant } = useCalendar();

  const type = event.type as VariantProps<
    typeof agendaEventCardVariants
  >["type"];
  const agendaEventCardClasses = agendaEventCardVariants({ type });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (e.currentTarget instanceof HTMLElement) e.currentTarget.click();
    }
  };

  return (
    <EventDetailsDialog event={event}>
      <div
        role="button"
        tabIndex={0}
        className={agendaEventCardClasses}
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            {["mixed", "dot"].includes(badgeVariant) && (
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                className="event-dot shrink-0"
              >
                <circle cx="4" cy="4" r="4" />
              </svg>
            )}

            <p className="font-medium">{event.title}</p>
          </div>

          <div className="flex items-center gap-1">
            <Text className="size-3 shrink-0" />
            <p className="text-xs text-foreground">{event.description}</p>
          </div>
        </div>
      </div>
    </EventDetailsDialog>
  );
}
