import { format } from "date-fns";

import { AgendaEventCard } from "@/modules/calendar/components/agenda-view/agenda-event-card";

import type { IEvent } from "@/modules/calendar/interfaces";

interface IProps {
  date: Date;
  events: IEvent[];
}

export function AgendaDayGroup({ date, events }: IProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="sticky top-0 flex items-center gap-4 bg-background py-2">
        <p className="text-sm font-semibold">
          {format(date, "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      <div className="space-y-2">
        {sortedEvents.length > 0 &&
          sortedEvents.map((event) => (
            <AgendaEventCard key={event.id} event={event} />
          ))}
      </div>
    </div>
  );
}
