"use client";
import { useMemo, useState } from "react";
import { isSameMonth, parseISO } from "date-fns";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { DndProviderWrapper } from "@/modules/calendar/components/dnd/dnd-provider";
import { CalendarHeader } from "@/modules/calendar/components/header/calendar-header";
import { CalendarMonthView } from "@/modules/calendar/components/month-view/calendar-month-view";
import { CalendarAgendaView } from "@/modules/calendar/components/agenda-view/calendar-agenda-view";
import type { TCalendarView } from "@/modules/calendar/types";

interface IProps {
  view: TCalendarView;
}

export function ClientContainer({ view }: IProps) {
  const { selectedDate, events } = useCalendar();
  const [showAgenda, setShowAgenda] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = parseISO(event.date);
      return isSameMonth(eventDate, selectedDate);
    });
  }, [selectedDate, events]);

  const toggleAgenda = () => {
    setShowAgenda((prev) => !prev);
  };

  return (
    <div className="overflow-hidden">
      <div className="flex gap-12">
        <CalendarHeader
          view={view}
          events={filteredEvents}
          showAgenda={showAgenda}
          onToggleAgenda={toggleAgenda}
        />
      </div>

      <div className="">
        <DndProviderWrapper>
          <div className="flex gap-16">
            <div className="border">
              <CalendarMonthView events={filteredEvents} />
            </div>
            {showAgenda && (
              <div className="border">
                <CalendarAgendaView events={filteredEvents} />
              </div>
            )}
          </div>
        </DndProviderWrapper>
      </div>
    </div>
  );
}
