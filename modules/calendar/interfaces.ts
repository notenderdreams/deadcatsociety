// File: interfaces.ts
import type { TEventType } from "@/modules/calendar/types";

export interface IEvent {
  id: number;
  date: string;
  title: string;
  type: TEventType;
  description: string;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}
