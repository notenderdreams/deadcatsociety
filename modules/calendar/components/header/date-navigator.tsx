import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  getEventsCount,
  navigateDate,
  rangeText,
} from "@/modules/calendar/helpers";

import type { IEvent } from "@/modules/calendar/interfaces";
import type { TCalendarView } from "@/modules/calendar/types";

interface IProps {
  view: TCalendarView;
  events: IEvent[];
}

export function DateNavigator({ view, events }: IProps) {
  const { selectedDate, setSelectedDate } = useCalendar();

  const eventCount = useMemo(
    () => getEventsCount(events, selectedDate),
    [events, selectedDate]
  );

  const handlePrevious = () =>
    setSelectedDate(navigateDate(selectedDate, view, "previous"));
  const handleNext = () =>
    setSelectedDate(navigateDate(selectedDate, view, "next"));

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
 
        <Badge variant="outline" className="px-1.5">
          {eventCount} events
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="size-6.5 px-0 [&_svg]:size-4.5"
          onClick={handlePrevious}
        >
          <ChevronLeft />
        </Button>

        <p className="text-sm text-muted-foreground">
          {rangeText(view, selectedDate)}
        </p>

        <Button
          variant="outline"
          className="size-6.5 px-0 [&_svg]:size-4.5"
          onClick={handleNext}
        >
          <ChevronRight />
        </Button>
      </div>
      
    </div>
  );
}
