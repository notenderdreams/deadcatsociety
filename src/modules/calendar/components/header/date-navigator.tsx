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

import type { TCalendarView } from "@/modules/calendar/types";
import { cn } from "@/lib/utils";
import { IEvent } from "@/types/models";

interface IProps {
  view: TCalendarView;
  events: IEvent[];
  showAgenda: boolean;
  onToggleAgenda: () => void;
}

export function DateNavigator({
  view,
  events,
  showAgenda,
  onToggleAgenda,
}: IProps) {
  const { selectedDate, setSelectedDate } = useCalendar();

  const eventCount = useMemo(
    () => getEventsCount(events, selectedDate),
    [events, selectedDate]
  );

  const handlePrevious = () =>
    setSelectedDate(navigateDate(selectedDate, view, "previous"));
  const handleNext = () =>
    setSelectedDate(navigateDate(selectedDate, view, "next"));

  const handleEventBadgeClick = () => {
    onToggleAgenda();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggleAgenda();
    }
  };

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={cn(
            "px-1.5 cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground select-none",
            showAgenda &&
              "bg-primary text-primary-foreground hover:bg-primary/90 border-none "
          )}
          onClick={handleEventBadgeClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`${eventCount} events - Click to ${
            showAgenda ? "hide" : "show"
          } agenda`}
        >
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
