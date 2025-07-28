import { Plus } from "lucide-react";

import { Button } from "@heroui/react";

import { TodayButton } from "@/modules/calendar/components/header/today-button";
import { DateNavigator } from "@/modules/calendar/components/header/date-navigator";
import { AddEventDialog } from "@/modules/calendar/components/dialogs/add-event-dialog";

import type { IEvent } from "@/modules/calendar/interfaces";
import type { TCalendarView } from "@/modules/calendar/types";
import { formatDate } from "date-fns";

interface IProps {
  view: TCalendarView;
  events: IEvent[];
}

export function CalendarHeader({ view, events }: IProps) {
  const today = new Date();
  return (
    <div className=" w-full flex flex-col gap-4  py-4  lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <TodayButton />
        <DateNavigator view={view} events={events} />
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
