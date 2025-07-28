import type { TEventColor } from "@/modules/calendar/types";

export interface IEvent {
  id: number;
  date: string;
  title: string;
  color: TEventColor;
  description: string;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}
