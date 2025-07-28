import { CalendarProvider } from "@/modules/calendar/contexts/calendar-context";
import { getEvents } from "@/modules/calendar/requests";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [events] = await Promise.all([getEvents()]);

  return <CalendarProvider events={events}>{children}</CalendarProvider>;
}
