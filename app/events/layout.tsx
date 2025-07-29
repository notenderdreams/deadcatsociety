"use client"
import { CalendarProvider } from "@/modules/calendar/contexts/calendar-context";
import { useInitializeEvents } from "@/hooks/useInitializeEvents";
import { useEffect } from "react";
import { useDatabaseStore } from "@/lib/store/useDatabaseStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const initializeEvents = useInitializeEvents();
  const { events, isLoading } = useDatabaseStore();

  useEffect(() => {
    if (events.length === 0 && !isLoading) {
      initializeEvents();
    }
  }, [events.length, isLoading, initializeEvents]);

  return (
    <CalendarProvider events={events}>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-8 py-4">
        {children}
      </div>
    </CalendarProvider>
  );
}
