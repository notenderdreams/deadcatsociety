import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { IEvent } from "@/types/models";

export function useUpdateEvent() {
  const { setLocalEvents } = useCalendar();

  const updateEvent = async (event: IEvent) => {
    const updatedEvent: IEvent = {
      ...event,
      date: new Date(event.date).toISOString(),
    };

    setLocalEvents((prev) => {
      const index = prev.findIndex((e) => e.id === event.id);
      if (index === -1) return prev;
      return [...prev.slice(0, index), updatedEvent, ...prev.slice(index + 1)];
    });

    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const savedEvent = await response.json();

      setLocalEvents((prev) => {
        const index = prev.findIndex((e) => e.id === savedEvent.id);
        if (index === -1) return prev;
        return [...prev.slice(0, index), savedEvent, ...prev.slice(index + 1)];
      });
    } catch (error) {
      console.error("API Error while updating event:", error);
    }
  };

  return { updateEvent };
}
