import { useDatabaseStore } from "@/lib/store/useDatabaseStore";

export const useInitializeEvents = () => {
  const { setEvents, setLoading, setError } = useDatabaseStore();

  return async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/events");
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
      const json = await res.json();
      setEvents(json);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unknown error during events initialization";
      console.error("Events initialization failed:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
};