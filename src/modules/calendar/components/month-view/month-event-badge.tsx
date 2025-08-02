import { cva } from "class-variance-authority";
import { format, isSameDay, parseISO } from "date-fns";

import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { DraggableEvent } from "@/modules/calendar/components/dnd/draggable-event";
import { EventDetailsDialog } from "@/modules/calendar/components/dialogs/event-details-dialog";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { IEvent } from "@/types/models";

const eventBadgeVariants = cva(
  "mx-1 flex size-auto h-6.5 select-none items-center justify-between gap-1.5 truncate whitespace-nowrap rounded-md border px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
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
  cellDate: Date;
  className?: string;
}

export function MonthEventBadge({ event, cellDate, className }: IProps) {
  const { badgeVariant } = useCalendar();

  const eventDate = parseISO(event.date);
  if (!isSameDay(cellDate, eventDate)) return null;

  const type = event.type as VariantProps<typeof eventBadgeVariants>["type"];
  const eventBadgeClasses = cn(eventBadgeVariants({ type }), className);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (e.currentTarget instanceof HTMLElement) e.currentTarget.click();
    }
  };

  return (
    <DraggableEvent event={event}>
      <EventDetailsDialog event={event}>
        <div
          role="button"
          tabIndex={0}
          className={eventBadgeClasses}
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center gap-1.5 truncate">
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
            <p className="flex-1 truncate font-semibold">{event.title}</p>
          </div>
          <span>{format(eventDate, "h:mm a")}</span>
        </div>
      </EventDetailsDialog>
    </DraggableEvent>
  );
}
