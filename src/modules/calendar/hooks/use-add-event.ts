"use client";

import { toast } from "sonner";
import { IEvent } from "@/types/models";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";

export function useAddEvent() {
  const { setLocalEvents } = useCalendar();

  const addEvent = async (
    newEventData: Omit<IEvent, "id" | "created_at" | "updated_at">,
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
            `Failed to create event. Status: ${response.status}`,
        );
      }

      const createdEvent: IEvent = await response.json();

      setLocalEvents((prevEvents) => [...prevEvents, createdEvent]);

      toast.success("Event created successfully!");
      return createdEvent;
    } catch (err) {
      console.error("Error adding event:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to create event.",
      );
    }
  };

  return { addEvent };
}
