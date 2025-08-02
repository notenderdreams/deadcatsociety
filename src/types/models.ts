import { TEventType } from "@/modules/calendar/types";

export interface DatabaseClass {
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
  
  export interface DatabaseCourse {
    id: string;
    semester_id: number;
    name: string;
    updated_at: string;
    classes?: DatabaseClass[];
  }
  
  export interface DatabaseSemester {
    id: number;
    name: string;
    is_active: boolean;
    image: string ;
    courses?: DatabaseCourse[];
  }
  
  export interface DatabaseStructure {
    semesters: DatabaseSemester[];
  }

export interface IEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: TEventType
  created_at: string;
  updated_at: string;
}