export interface MockClass {
  id: string;
  course_id: string;
  title: string;
  description: string;
  topics: string[];
  notes: string[];
  references: string[];
  contributors: string[];
  updated_at: string;
}

export interface MockCourse {
  id: string;
  semester_id: number;
  name: string;
  updated_at: string;
  classes: MockClass[];
}

export interface MockSemester {
  id: number;
  name: string;
  is_active: boolean;
  courses: MockCourse[];
}

export interface MockDatabase {
  semesters: MockSemester[];
}

export const mockDatabase: MockDatabase = {
  semesters: [
    {
      id: 1,
      name: "Summer 2025",
      is_active: true,
      courses: [],
    },
    {
      id: 2,
      name: "Winter 2024",
      is_active: false,
      courses: [
        {
          id: "CSE2101",
          semester_id: 2,
          name: "Data Structures",
          updated_at: "2024-12-15T11:00:00Z",
          classes: [
            {
              id: "class-ds-1",
              course_id: "CSE2101",
              title: "Arrays and Linked Lists",
              description: `
## Arrays and Linked Lists
In this class, we covered:
- Array operations (insertion, deletion, search)
- Singly Linked Lists
- Doubly Linked Lists
- Time and Space Complexity basics

Useful diagrams and examples were included to show memory representation.
    `,
              topics: [
                "Array Operations",
                "Singly Linked List",
                "Doubly Linked List",
                "Time Complexity",
              ],
              notes: ["https://example.com/notes/ds-bigo-cheatsheet.pdf"],
              references: [
                "https://visualgo.net/en/list",
                "https://en.wikipedia.org/wiki/Linked_list",
              ],
              contributors: ["prof.ds@university.edu"],
              updated_at: "2024-11-01T10:00:00Z",
            },
            {
              id: "class-ds-2",
              course_id: "CSE2101",
              title: "Stacks and Queues",
              description: `
## Stacks and Queues
Topics included:
- Stack and Queue data structures
- Operations: push, pop, enqueue, dequeue
- LIFO and FIFO concepts
- Use-cases like undo-redo and printer queues
    `,
              topics: ["Stack", "Queue", "LIFO", "FIFO", "Applications"],
              notes: ["https://example.com/notes/stacks-queues.pdf"],
              references: [
                "https://visualgo.net/en/stack",
                "https://visualgo.net/en/queue",
              ],
              contributors: ["prof.ds@university.edu"],
              updated_at: "2024-11-05T10:00:00Z",
            },
            {
              id: "class-algo-1",
              course_id: "CSE2202",
              title: "Time Complexity and Recursion",
              description: `
## Time Complexity and Recursion
This class introduces:
- The concept of recursion
- Base case and recursive case
- Time complexity analysis using Big O
- Introduction to the Master Theorem for divide and conquer algorithms
    `,
              topics: ["Recursion", "Big O", "Master Theorem"],
              notes: ["https://example.com/notes/recursion-complexity.pdf"],
              references: [
                "https://en.wikipedia.org/wiki/Recursion_(computer_science)",
                "https://www.bigocheatsheet.com/",
              ],
              contributors: ["tanjim@example.com"],
              updated_at: "2024-11-15T09:00:00Z",
            },
            {
              id: "dld-class1-uuid",
              course_id: "EEE2201",
              title: "Number Systems & Boolean Algebra",
              description: `
## Number Systems & Boolean Algebra
Covered topics:
- Conversion between Binary, Octal, Decimal, and Hexadecimal
- Boolean Laws and simplification
- Truth Tables and logical expressions
- DeMorgan's Theorems
    `,
              topics: [
                "Binary",
                "Octal",
                "Hexadecimal",
                "Boolean Laws",
                "Truth Tables",
              ],
              notes: ["https://example.com/notes/boolean-algebra.pdf"],
              references: [
                "https://en.wikipedia.org/wiki/Boolean_algebra",
                "https://www.geeksforgeeks.org/number-systems/",
              ],
              contributors: ["prof.logic@university.edu"],
              updated_at: "2024-11-05T10:00:00Z",
            },
          ],
        },
        {
          id: "CSE2202",
          semester_id: 2,
          name: "Algorithms",
          updated_at: "2024-12-16T09:30:00Z",
          classes: [
            {
              id: "class-algo-1",
              course_id: "CSE2202",
              title: "Time Complexity and Recursion",
              description:
                "https://raw.githubusercontent.com/deadcatsociety/notes/main/CSE2202/Recursion_TimeComplexity.md",
              topics: ["Recursion", "Big O", "Master Theorem"],
              notes: ["https://example.com/notes/recursion-complexity.pdf"],
              references: [
                "https://en.wikipedia.org/wiki/Recursion_(computer_science)",
                "https://www.bigocheatsheet.com/",
              ],
              contributors: ["tanjim@example.com"],
              updated_at: "2024-11-15T09:00:00Z",
            },
          ],
        },
      ],
    },
  ],
};

// Helper functions

export const getActiveSemester = (): MockSemester | undefined =>
  mockDatabase.semesters.find((s) => s.is_active);

export const getSemesterById = (id: number): MockSemester | undefined =>
  mockDatabase.semesters.find((s) => s.id === id);

export const getCourseById = (code: string): MockCourse | undefined => {
  for (const semester of mockDatabase.semesters) {
    const course = semester.courses.find((c) => c.id === code);
    if (course) return course;
  }
  return undefined;
};

export const getClassById = (id: string): MockClass | undefined => {
  for (const semester of mockDatabase.semesters) {
    for (const course of semester.courses) {
      const cls = course.classes.find((c) => c.id === id);
      if (cls) return cls;
    }
  }
  return undefined;
};

export const getCoursesForSemester = (semesterId: number): MockCourse[] => {
  const semester = mockDatabase.semesters.find((s) => s.id === semesterId);
  return semester ? semester.courses : [];
};

export const getClassesForCourse = (courseId: string): MockClass[] => {
  const course = getCourseById(courseId);
  return course ? course.classes : [];
};
