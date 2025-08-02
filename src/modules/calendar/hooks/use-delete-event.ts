// src/modules/calendar/hooks/use-delete-event.ts
"use client";
import { useDatabaseStore } from "@/lib/store/useDatabaseStore"; // Importing the store
import { toast } from "sonner";

export function useDeleteEvent() {
  // Getting the setEvents function from the store
  const setEvents = useDatabaseStore((state) => state.setEvents);

  const deleteEvent = async (eventId: string) => {
    try {
      // --- API Call ---
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Failed to delete event. Status: ${response.status}`,
        );
      }

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId),
      );

      toast.success("Event deleted successfully!");
      return true;
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to delete event.",
      );
    }
  };

  return { deleteEvent };
}
