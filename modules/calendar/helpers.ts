import {
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  format,
  parseISO,
  differenceInMinutes,
  startOfDay,
  eachDayOfInterval,
} from "date-fns";

import type { ICalendarCell, IEvent } from "@/modules/calendar/interfaces";
import type { TCalendarView } from "@/modules/calendar/types";

export function rangeText(view: TCalendarView, date: Date) {
  const formatString = "MMM d, yyyy";
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return `${format(start, formatString)} - ${format(end, formatString)}`;
}

export function navigateDate(
  date: Date,
  view: TCalendarView,
  direction: "previous" | "next"
): Date {
  return direction === "next" ? addMonths(date, 1) : subMonths(date, 1);
}

export function getEventsCount(events: IEvent[], date: Date): number {
  return events.filter((event) => isSameMonth(parseISO(event.date), date))
    .length;
}

export function getCurrentEvents(events: IEvent[]) {
  const now = new Date();
  const today = startOfDay(now);
  return events.filter((event) => {
    const eventDate = startOfDay(parseISO(event.date));
    return isSameDay(eventDate, today) && parseISO(event.date) <= now;
  });
}

export function getEventBlockStyle(
  event: IEvent,
  day: Date,
  groupIndex: number,
  groupSize: number,
  visibleHoursRange?: { from: number; to: number }
) {
  const startTime = parseISO(event.date);
  const dayStart = startOfDay(day);
  const startMinutes = differenceInMinutes(startTime, dayStart);

  let top;

  if (visibleHoursRange) {
    const visibleStartMinutes = visibleHoursRange.from * 60;
    const visibleEndMinutes = visibleHoursRange.to * 60;
    const visibleRangeMinutes = visibleEndMinutes - visibleStartMinutes;
    top = ((startMinutes - visibleStartMinutes) / visibleRangeMinutes) * 100;
  } else {
    top = (startMinutes / 1440) * 100;
  }

  const width = 100 / groupSize;
  const left = groupIndex * width;

  return { top: `${top}%`, width: `${width}%`, left: `${left}%` };
}

export function getCalendarCells(selectedDate: Date): ICalendarCell[] {
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);

  const prevMonthCells = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    day: daysInPrevMonth - firstDayOfMonth + i + 1,
    currentMonth: false,
    date: new Date(
      currentYear,
      currentMonth - 1,
      daysInPrevMonth - firstDayOfMonth + i + 1
    ),
  }));

  const currentMonthCells = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    currentMonth: true,
    date: new Date(currentYear, currentMonth, i + 1),
  }));

  const remainingDays = (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7;
  const nextMonthCells = Array.from({ length: remainingDays }, (_, i) => ({
    day: i + 1,
    currentMonth: false,
    date: new Date(currentYear, currentMonth + 1, i + 1),
  }));

  return [...prevMonthCells, ...currentMonthCells, ...nextMonthCells];
}

export function calculateEventPositions(events: IEvent[], selectedDate: Date) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  const eventPositions: Record<string, number> = {};
  const occupiedPositions: Record<string, boolean[]> = {};

  // Initialize occupied positions for each day
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  daysInMonth.forEach((day) => {
    occupiedPositions[day.toISOString()] = [false, false, false];
  });

  // Sort events by time
  const sortedEvents = [...events].sort(
    (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );

  // Assign positions
  sortedEvents.forEach((event) => {
    const eventDate = startOfDay(parseISO(event.date));
    const dayKey = eventDate.toISOString();

    if (!occupiedPositions[dayKey]) return;

    // Find first available position
    const position = occupiedPositions[dayKey].findIndex(
      (occupied) => !occupied
    );
    if (position !== -1) {
      occupiedPositions[dayKey][position] = true;
      eventPositions[event.id] = position;
    }
  });

  return eventPositions;
}

export function getDayEvents(date: Date, events: IEvent[]) {
  return events.filter((event) => isSameDay(parseISO(event.date), date));
}

export function calculateMonthEventPositions(
  events: IEvent[],
  selectedDate: Date
) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  const eventPositions: { [key: string]: number } = {};
  const occupiedPositions: { [key: string]: boolean[] } = {};

  eachDayOfInterval({ start: monthStart, end: monthEnd }).forEach((day) => {
    occupiedPositions[day.toISOString()] = [false, false, false];
  });

  const sortedEvents = [
    ...events.sort(
      (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
    ),
  ];

  sortedEvents.forEach((event) => {
    const eventStart = parseISO(event.date);
    const eventEnd = parseISO(event.date);
    const eventDays = eachDayOfInterval({
      start: eventStart < monthStart ? monthStart : eventStart,
      end: eventEnd > monthEnd ? monthEnd : eventEnd,
    });

    let position = -1;

    for (let i = 0; i < 3; i++) {
      if (
        eventDays.every((day) => {
          const dayPositions = occupiedPositions[startOfDay(day).toISOString()];
          return dayPositions && !dayPositions[i];
        })
      ) {
        position = i;
        break;
      }
    }

    if (position !== -1) {
      eventDays.forEach((day) => {
        const dayKey = startOfDay(day).toISOString();
        occupiedPositions[dayKey][position] = true;
      });
      eventPositions[event.id] = position;
    }
  });

  return eventPositions;
}

export function getMonthCellEvents(
  date: Date,
  events: IEvent[],
  eventPositions: Record<string, number>
) {
  const eventsForDate = events.filter((event) => {
    const eventStart = parseISO(event.date);
    const eventEnd = parseISO(event.date);
    return (
      (date >= eventStart && date <= eventEnd) ||
      isSameDay(date, eventStart) ||
      isSameDay(date, eventEnd)
    );
  });

  return eventsForDate
    .map((event) => ({
      ...event,
      position: eventPositions[event.id] ?? -1,
      isMultiDay: false,
    }))
    .sort((a, b) => {
      return a.position - b.position;
    });
}
