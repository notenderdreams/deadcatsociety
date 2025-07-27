// lib/store/useDatabaseStore.ts
import { create } from "zustand";
import {
  mockDatabase,
  MockDatabase,
  MockSemester,
  MockCourse,
  // Renamed import back to MockClass to match mockData.ts
  MockClass,
} from "@/lib/mock"; // Adjust path if needed to point to the correct mock file

// Define the shape of your Zustand store state
interface DatabaseState {
  // The core data structure matching your mock
  data: MockDatabase;
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  // Actions to update the state
  setData: (newData: MockDatabase) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  // Derived selectors or helper actions
  getActiveSemester: () => MockSemester | undefined;
  getSemesterById: (id: number) => MockSemester | undefined;
  // Note: getCourseByCode requires 'code' field in MockCourse (not present in provided mockData.ts)
  // Keeping it if you plan to add 'code' later, but it won't work with current mockData.ts
  getCourseByCode: (code: string) => MockCourse | undefined;
  getCourseById: (id: string) => MockCourse | undefined; // Find course by its ID
  // Updated return type to MockClass
  getClassById: (id: string) => MockClass | undefined;
  getCoursesForSemester: (semesterId: number) => MockCourse[];
  // Updated return type to MockClass[]
  getClassesForCourse: (courseId: string) => MockClass[];
}

// Create the Zustand store
export const useDatabaseStore = create<DatabaseState>()((set, get) => ({
  // Initial state
  data: { semesters: [] },
  isLoading: false,
  error: null,

  // Actions
  setData: (newData) => set({ data: newData, isLoading: false, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),

  // Derived Selectors / Helpers
  getActiveSemester: () => {
    return get().data.semesters.find((s) => s.is_active);
  },
  getSemesterById: (id) => {
    return get().data.semesters.find((s) => s.id === id);
  },
  // This will not work correctly with the provided mockData.ts as MockCourse lacks 'code'
  // It requires MockCourse to have a 'code' field.
  getCourseByCode: (code) => {
    for (const semester of get().data.semesters) {
      // Requires MockCourse to have a 'code' property
      const course = semester.courses.find((c) => c.code === code);
      if (course) return course;
    }
    return undefined;
  },
  // Find a course by its unique ID (matches mockData.ts MockCourse.id)
  getCourseById: (id) => {
    for (const semester of get().data.semesters) {
      const course = semester.courses.find((c) => c.id === id);
      if (course) return course;
    }
    return undefined;
  },
  // Updated return type and logic to use MockClass
  getClassById: (id) => {
    for (const semester of get().data.semesters) {
      for (const course of semester.courses) {
        // Accesses the 'classes' array of MockCourse
        const cls = course.classes.find((c) => c.id === id);
        if (cls) return cls; // Returns MockClass object
      }
    }
    return undefined;
  },
  getCoursesForSemester: (semesterId) => {
    const semester = get().getSemesterById(semesterId);
    return semester ? semester.courses : [];
  },
  // Updated return type and logic to use MockClass
  getClassesForCourse: (courseId) => {
    const course = get().getCourseById(courseId);
    // Accesses the 'classes' array of MockCourse and returns MockClass[]
    return course ? course.classes : [];
  },
}));

// Hook for initializing data
export const useInitializeDatabase = () => {
  const { setData, setLoading, setError } = useDatabaseStore();

  return async () => {
    // Check if data is already loaded
    if (useDatabaseStore.getState().data.semesters.length > 0) {
      console.log("Data already initialized.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("Initializing with mock data...");
      // Set data using the imported mock data structure
      setData(mockDatabase);
      console.log("Data initialized successfully.");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load data";
      console.error("Error initializing database store:", errorMessage);
      setError(errorMessage);
    } finally {
      // setLoading(false); // Not strictly needed as setData handles it
    }
  };
};
