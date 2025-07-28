"use client";

import { useMemo } from "react";
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

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = parseISO(event.date);
      return isSameMonth(eventDate, selectedDate);
    });
  }, [selectedDate, events]);

  return (
    <div className="overflow-hidden">
      <CalendarHeader view={view} events={filteredEvents} />
      <div className="border border-t-0">
        <DndProviderWrapper>
          {view === "month" && <CalendarMonthView events={filteredEvents} />}
          {view === "agenda" && <CalendarAgendaView events={filteredEvents} />}
        </DndProviderWrapper>
      </div>
    </div>
  );
}
