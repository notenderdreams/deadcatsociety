import {
  DatabaseClass,
  DatabaseCourse,
  DatabaseSemester,
  DatabaseStructure,
} from "@/types/models";
import { create } from "zustand";

interface DatabaseState {
  data: DatabaseStructure;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  setData: (newData: DatabaseStructure) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  getActiveSemester: () => DatabaseSemester | undefined;
  getSemesterById: (id: number) => DatabaseSemester | undefined;
  getCourseById: (id: string) => DatabaseCourse | undefined;
  getClassById: (id: string) => DatabaseClass | undefined;
  getCoursesForSemester: (semesterId: number) => DatabaseCourse[];
  getClassesForCourse: (courseId: string) => DatabaseClass[];
}

export const useDatabaseStore = create<DatabaseState>()((set, get) => ({
  data: { semesters: [] },
  isLoading: false,
  error: null,
  isInitialized: false,
  setData: (newData) => set({ data: newData, isLoading: false, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
  getActiveSemester: () => {
    return get().data.semesters.find((s) => s.is_active);
  },
  getSemesterById: (id) => {
    return get().data.semesters.find((s) => s.id === id);
  },
  getCourseById: (id) => {
    for (const semester of get().data.semesters) {
      if (semester.courses) {
        const course = semester.courses.find((c) => c.id === id);
        if (course) return course;
      }
    }
    return undefined;
  },
  getClassById: (id) => {
    for (const semester of get().data.semesters) {
      if (semester.courses) {
        for (const course of semester.courses) {
          if (course.classes) {
            const cls = course.classes.find((c) => c.id === id);
            if (cls) return cls;
          }
        }
      }
    }
    return undefined;
  },
  getCoursesForSemester: (semesterId) => {
    const semester = get().getSemesterById(semesterId);
    return semester && semester.courses ? semester.courses : [];
  },
  getClassesForCourse: (courseId) => {
    const course = get().getCourseById(courseId);
    return course && course.classes ? course.classes : [];
  },
}));

export const useInitializeDatabase = () => {
  const { setData, setLoading, setError, setInitialized, isInitialized } =
    useDatabaseStore(); 

  return async () => {
    if (isInitialized) {
      console.log("Database initialization already attempted.");
      return;
    }
    setInitialized(true);

    setLoading(true);
    setError(null);
    try {
      console.log("Fetching data from /api/notes...");
      const res = await fetch("/api/notes");
      console.log("Fetch response status:", res.status);
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
      const json = await res.json();
      console.log("Data fetched successfully:", json);
      setData(json as DatabaseStructure);
      console.log("Data set in Zustand store.");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unknown error during initialization";
      console.error("Initialization failed:", msg);
      setError(msg);
    }
  };
};
