
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { Button } from "@heroui/react";

export function TodayButton() {
  const { setSelectedDate } = useCalendar();

  const today = new Date();
  const handleClick = () => setSelectedDate(today);

  return (
    <Button onPress={handleClick} size="lg" color="primary">
      <div>
        <div className="text-6xl font-bold text-neutral-100 ">
          {today.getDate()}
        </div>
      </div>
    </Button>
  );
}
