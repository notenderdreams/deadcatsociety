import { useMemo, useState } from "react";
import { isToday, startOfDay } from "date-fns";

import { EventBullet } from "@/modules/calendar/components/month-view/event-bullet";
import { DroppableDayCell } from "@/modules/calendar/components/dnd/droppable-day-cell";
import { MonthEventBadge } from "@/modules/calendar/components/month-view/month-event-badge";
import { AddEventDialog } from "@/modules/calendar/components/dialogs/add-event-dialog";

import { cn } from "@/lib/utils";
import { getMonthCellEvents } from "@/modules/calendar/helpers";

import type { ICalendarCell, IEvent } from "@/modules/calendar/interfaces";
import { Plus } from "lucide-react";

interface IProps {
  cell: ICalendarCell;
  events: IEvent[];
  eventPositions: Record<string, number>;
}

const MAX_VISIBLE_EVENTS = 3;

export function DayCell({ cell, events, eventPositions }: IProps) {
  const { day, currentMonth, date } = cell;
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const cellEvents = useMemo(
    () => getMonthCellEvents(date, events, eventPositions),
    [date, events, eventPositions]
  );
  const isSunday = date.getDay() === 0;

  const handleEmptyAreaClick = () => {
    setIsAddEventOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsAddEventOpen(true);
    }
  };

  return (
    <DroppableDayCell cell={cell}>
      <div
        className={cn(
          "flex h-full min-h-[120px] lg:min-w-45 flex-col gap-1 border-l border-t py-1.5 lg:py-2 relative",
          isSunday && "border-l-0"
        )}
      >
        <div className="absolute inset-0 pointer-events-none" />

        <AddEventDialog
          startDate={date}
          startTime={{ hour: 9, minute: 0 }}
          open={isAddEventOpen}
          onOpenChange={setIsAddEventOpen}
        >
          <div
            className={cn(
              "h-6 px-1 lg:px-2 relative z-10 flex items-center justify-between cursor-pointer group transition-colors",
              "hover:bg-neutral-800",
              !currentMonth && "opacity-20"
            )}
            onClick={handleEmptyAreaClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Add event on ${date.toLocaleDateString()}`}
          >
            <span
              className={cn(
                "text-xs font-semibold transition-colors group-hover:text-white",
                isToday(date) &&
                  "flex w-6 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground group-hover:bg-white group-hover:text-neutral-800"
              )}
            >
              {day}
            </span>

            <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus size={15} />
            </div>
          </div>
        </AddEventDialog>

        <div
          className={cn(
            "flex min-h-[94px] gap-1 px-2 lg:flex-col lg:gap-2 lg:px-0 relative z-10",
            !currentMonth && "opacity-50"
          )}
        >
          {[0, 1, 2].map((position) => {
            const event = cellEvents.find((e) => e.position === position);
            const eventKey = event
              ? `event-${event.id}-${position}`
              : `empty-${position}`;

            return (
              <div key={eventKey} className="lg:flex-1">
                {event && (
                  <>
                    <EventBullet className="lg:hidden" type={event.type} />
                    <MonthEventBadge
                      className="hidden lg:flex"
                      event={event}
                      cellDate={startOfDay(date)}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {cellEvents.length > MAX_VISIBLE_EVENTS && (
          <p
            className={cn(
              "h-4.5 px-1.5 text-xs font-semibold text-muted-foreground relative z-10 pointer-events-none",
              !currentMonth && "opacity-50"
            )}
          >
            <span className="sm:hidden">
              +{cellEvents.length - MAX_VISIBLE_EVENTS}
            </span>
            <span className="hidden sm:inline">
              {cellEvents.length - MAX_VISIBLE_EVENTS} more...
            </span>
          </p>
        )}
      </div>
    </DroppableDayCell>
  );
}
