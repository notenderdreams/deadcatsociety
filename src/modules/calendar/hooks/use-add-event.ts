// modules/calendar/hooks/use-add-event.ts
"use client";

import { useDatabaseStore } from "@/lib/store/useDatabaseStore";
import { toast } from "sonner";
import { IEvent } from "@/types/models"; // Adjust import path if needed

export function useAddEvent() {
  const setEvents = useDatabaseStore((state) => state.setEvents);

  const addEvent = async (
    newEventData: Omit<IEvent, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEventData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Failed to create event. Status: ${response.status}`
        );
      }

      const createdEvent: IEvent = await response.json();

      // Optimistic Update: Add the new event to the Zustand store
      setEvents((prevEvents) => [...prevEvents, createdEvent]);

      toast.success("Event created successfully!");
      return createdEvent;
    } catch (err) {
      console.error("Error adding event:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to create event."
      );
    }
  };

  return { addEvent };
}
