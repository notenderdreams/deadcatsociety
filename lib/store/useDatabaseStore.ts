import { create } from "zustand";
import {
  DatabaseClass,
  DatabaseCourse,
  DatabaseSemester,
  DatabaseEvent,
  DatabaseStructure,
} from "@/types/models";

interface DatabaseState {
  data: DatabaseStructure;
  events: DatabaseEvent[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  eventsInitialized: boolean;
  setData: (newData: DatabaseStructure) => void;
  setEvents: (events: DatabaseEvent[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  setEventsInitialized: (initialized: boolean) => void;
  getActiveSemester: () => DatabaseSemester | undefined;
  getSemesterById: (id: number) => DatabaseSemester | undefined;
  getCourseById: (id: string) => DatabaseCourse | undefined;
  getClassById: (id: string) => DatabaseClass | undefined;
  getEventById: (id: string) => DatabaseEvent | undefined;
  getCoursesForSemester: (semesterId: number) => DatabaseCourse[];
  getClassesForCourse: (courseId: string) => DatabaseClass[];
}

export const useDatabaseStore = create<DatabaseState>()((set, get) => ({
  data: { semesters: [] },
  events: [],
  isLoading: false,
  error: null,
  isInitialized: false,
  eventsInitialized: false,
  setData: (newData) => set({ data: newData }),
  setEvents: (events) => set({ events }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
  setEventsInitialized: (initialized) =>
    set({ eventsInitialized: initialized }),
  getActiveSemester: () => get().data.semesters.find((s) => s.is_active),
  getSemesterById: (id) => get().data.semesters.find((s) => s.id === id),
  getCourseById: (id) => {
    for (const semester of get().data.semesters) {
      const course = semester.courses?.find((c) => c.id === id);
      if (course) return course;
    }
    return undefined;
  },
  getClassById: (id) => {
    for (const semester of get().data.semesters) {
      if (semester.courses) {
        for (const course of semester.courses) {
          const cls = course.classes?.find((c) => c.id === id);
          if (cls) return cls;
        }
      }
    }
    return undefined;
  },
  getEventById: (id) => get().events.find((event) => event.id === id),
  getCoursesForSemester: (semesterId) => {
    const semester = get().getSemesterById(semesterId);
    return semester?.courses || [];
  },
  getClassesForCourse: (courseId) => {
    const course = get().getCourseById(courseId);
    return course?.classes || [];
  },
}));

export const useInitializeDatabase = () => {
  const { setData, setLoading, setError, setInitialized, isInitialized } =
    useDatabaseStore();

  return async () => {
    if (isInitialized) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error(`Failed with status ${res.status}`);
      const data = await res.json();
      setData(data);
      setInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };
};

export const useInitializeEvents = () => {
  const {
    setEvents,
    setLoading,
    setError,
    eventsInitialized,
    setEventsInitialized,
  } = useDatabaseStore();

  return async () => {
    if (eventsInitialized) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error(`Failed with status ${res.status}`);
      const events = await res.json();
      setEvents(events);
      setEventsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };
};
