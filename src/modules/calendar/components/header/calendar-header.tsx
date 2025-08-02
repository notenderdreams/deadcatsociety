import { TodayButton } from "@/modules/calendar/components/header/today-button";
import { DateNavigator } from "@/modules/calendar/components/header/date-navigator";

import type { TCalendarView } from "@/modules/calendar/types";
import { formatDate } from "date-fns";
import { IEvent } from "@/types/models";

interface IProps {
  view: TCalendarView;
  events: IEvent[];
  showAgenda: boolean;
  onToggleAgenda: () => void;
}

export function CalendarHeader({
  view,
  events,
  showAgenda,
  onToggleAgenda,
}: IProps) {
  const today = new Date();
  return (
    <div className=" w-full flex flex-col gap-4  py-4  lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <TodayButton />
        <DateNavigator
          view={view}
          events={events}
          showAgenda={showAgenda}
          onToggleAgenda={onToggleAgenda}
        />
      </div>

      <div className="flex gap-4 items-center">
        <div>
          {/* <AddEventDialog>
            <Button
              color="default"
              size="sm"
              endContent={<Plus />}
              className="bg-neutral-800 text-neutral-100 rounded"
            >
              Add Event
            </Button>
          </AddEventDialog> */}
        </div>
        <div className="text-6xl font-bold flex ">
          {formatDate(today, "MMMM").toUpperCase()}
          {today.getFullYear()}
        </div>
      </div>
    </div>
  );
}
