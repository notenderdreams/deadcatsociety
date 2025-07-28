import { Plus } from "lucide-react";

import { Button } from "@heroui/react";

import { TodayButton } from "@/modules/calendar/components/header/today-button";
import { DateNavigator } from "@/modules/calendar/components/header/date-navigator";
import { AddEventDialog } from "@/modules/calendar/components/dialogs/add-event-dialog";

import type { IEvent } from "@/modules/calendar/interfaces";
import type { TCalendarView } from "@/modules/calendar/types";
import { ViewChangeTab } from "@/modules/calendar/components/ViewChangeTab";

interface IProps {
  view: TCalendarView;
  events: IEvent[];
}

export function CalendarHeader({ view, events }: IProps) {
  return (
    <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <TodayButton />
        <DateNavigator view={view} events={events} />
      </div>

      <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-between">
        <div className="flex w-full items-center gap-1.5">
          <ViewChangeTab />
        </div>

        <AddEventDialog>
          <Button className="w-full rounded-md border-2 bg-neutral-800 text-white sm:w-auto">
            <Plus />
            Add Event
          </Button>
        </AddEventDialog>
      </div>
    </div>
  );
}
