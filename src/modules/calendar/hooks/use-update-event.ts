import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { IEvent } from "@/types/models";


export function useUpdateEvent() {
  const { setLocalEvents } = useCalendar();

  // This is just and example, in a real scenario
  // you would call an API to update the event
  const updateEvent = (event: IEvent) => {
    const newEvent: IEvent = event;

    newEvent.date = new Date(event.date).toISOString();

    setLocalEvents((prev) => {
      const index = prev.findIndex((e) => e.id === event.id);
      if (index === -1) return prev;
      return [...prev.slice(0, index), newEvent, ...prev.slice(index + 1)];
    });
  };

  return { updateEvent };
}
