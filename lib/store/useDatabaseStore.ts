// lib/store/useDatabaseStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // Optional: for persistence
import {
  mockDatabase,
  MockDatabase,
  MockSemester,
  MockCourse,
  MockNote,
} from "@/lib/mock"; // Adjust path if needed
// Removed unused imports: error, get, and individual helper functions that are now defined in the store

// Define the shape of your Zustand store state
interface DatabaseState {
  // The core data structure matching your mock
  data: MockDatabase;
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  // Actions to update the state
  setData: (newData: MockDatabase) => void; // Added type for newData parameter
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  // Optional: Derived selectors or helper actions can be added here or inline in components
  // Example derived selector (we'll use this pattern in components too)
  getActiveSemester: () => MockSemester | undefined;
  getSemesterById: (id: number) => MockSemester | undefined;
  getCourseByCode: (code: string) => MockCourse | undefined;
  getCourseById: (id: string) => MockCourse | undefined; // Add this for convenience
  getClassById: (id: string) => MockNote | undefined;
  getCoursesForSemester: (semesterId: number) => MockCourse[];
  getClassesForCourse: (courseId: string) => MockNote[]; // Note: courseId is a string (UUID)
}

// Create the Zustand store
export const useDatabaseStore = create<DatabaseState>()(
  // Optional: Add persistence if you want the data to survive page reloads (requires data to be serializable)
  // persist(
  (set, get) => ({
    // Initial state - FIXED THE SYNTAX ERROR HERE
    data: { semesters: [] }, // Start with empty data - Added 'data:' key
    isLoading: false,
    error: null,

    // Actions
    setData: (newData) => set({ data: newData, isLoading: false, error: null }), // Added 'data:' key
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error, isLoading: false }),

    // Derived Selectors / Helpers (These don't change state, just compute from it)
    getActiveSemester: () => {
      return get().data.semesters.find((s) => s.is_active);
    },
    getSemesterById: (id) => {
      return get().data.semesters.find((s) => s.id === id);
    },
    getCourseByCode: (code) => {
      for (const semester of get().data.semesters) {
        const course = semester.courses.find((c) => c.code === code);
        if (course) return course;
      }
      return undefined;
    },
    // Find a course by its unique ID
    getCourseById: (id) => {
      for (const semester of get().data.semesters) {
        const course = semester.courses.find((c) => c.id === id);
        if (course) return course;
      }
      return undefined;
    },
    getClassById: (id) => {
      for (const semester of get().data.semesters) {
        for (const course of semester.courses) {
          const cls = course.classes.find((c) => c.id === id);
          if (cls) return cls;
        }
      }
      return undefined;
    },
    getCoursesForSemester: (semesterId) => {
      const semester = get().getSemesterById(semesterId);
      return semester ? semester.courses : [];
    },
    getClassesForCourse: (courseId) => {
      const course = get().getCourseById(courseId); // Use the new helper
      return course ? course.classes : [];
    },
  })
  //   {
  //     name: 'database-storage', // Name of the item in storage
  //     storage: createJSONStorage(() => localStorage), // Use localStorage
  //   }
  // )
);

// Optional: Create a hook for initializing data (e.g., in a layout or root component)
export const useInitializeDatabase = () => {
  const { setData, setLoading, setError } = useDatabaseStore();

  return async () => {
    if (useDatabaseStore.getState().data.semesters.length > 0) {
      // Data already loaded, maybe check freshness or skip
      console.log("Mock data already initialized.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // In a real app, you'd fetch from `/api/notes`
      // const response = await fetch('/api/notes');
      // const fetchedData: MockDatabase = await response.json();

      // For now, simulate fetching with mock data
      // You can replace this with the actual fetch call above later.
      console.log("Initializing with mock data...");
      // Simulate network delay
      // await new Promise(resolve => setTimeout(resolve, 800));
      setData(mockDatabase); // Use the imported mock data
      console.log("Mock data initialized successfully.");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load data";
      console.error("Error initializing database store:", errorMessage);
      setError(errorMessage);
    } finally {
      // setLoading(false); // Not needed here as setData sets loading to false
    }
  };
};
