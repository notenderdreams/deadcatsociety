import { pgTable, text, integer, boolean, timestamp, uuid} from "drizzle-orm/pg-core";

//  Semester 
export const semesters = pgTable("semesters", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(),
  is_active: boolean("is_active").notNull(),
});

// Course
export const courses = pgTable("courses", {
  id: text("id").primaryKey().notNull(),  // Course Code 
  semester_id: integer("semester_id")
    .references(() => semesters.id)
    .notNull(),
  name: text("name").notNull(),
  updated_at: timestamp("updated_at", { mode: "string" }).notNull(),
});

//  Class 
export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().notNull(),  
  course_id: text("course_id")
    .references(() => courses.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  topics: text("topics").array(),
  notes: text("notes").array().notNull(),          
  references: text("references").array(), 
  contributors: text("contributors").array().notNull(), 
  updated_at: timestamp("updated_at", { mode: "string" }).notNull(),
});
