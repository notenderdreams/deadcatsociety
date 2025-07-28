import { CalendarProvider } from "@/modules/calendar//contexts/calendar-context";
import { getEvents } from "@/modules/calendar/requests";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [events] = await Promise.all([getEvents()]);

  return (
    <CalendarProvider events={events}>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-8 py-4">
        {children}
      </div>
    </CalendarProvider>
  );
}
