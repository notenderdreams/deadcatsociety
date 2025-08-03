"use client";

import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { toast } from "sonner";

export function useDeleteEvent() {
  const { setLocalEvents } = useCalendar();

  const deleteEvent = async (eventId: string) => {
    try {
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

      // Update local state after successful deletion
      setLocalEvents((prevEvents) =>
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
