import { useMemo } from "react";

import { useCalendar } from "@/modules/calendar/contexts/calendar-context";

import { DayCell } from "@/modules/calendar/components/month-view/day-cell";

import {
  getCalendarCells,
  calculateMonthEventPositions,
} from "@/modules/calendar/helpers";
import { IEvent } from "@/types/models";


interface IProps {
  events: IEvent[];
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarMonthView({ events }: IProps) {
  const { selectedDate } = useCalendar();

  const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);

  const eventPositions = useMemo(
    () => calculateMonthEventPositions(events, selectedDate),
    [events, selectedDate]
  );

  return (
    <div>
      <div className="grid grid-cols-7 divide-x">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="flex items-center justify-center py-2">
            <span className="text-xs font-medium text-muted-foreground">
              {day}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 min-w-4xl overflow-hidden">
        {cells.map((cell) => (
          <DayCell
            key={cell.date.toISOString()}
            cell={cell}
            events={events}
            eventPositions={eventPositions}
          />
        ))}
      </div>
    </div>
  );
}
