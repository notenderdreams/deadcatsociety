import { pgTable, text, integer, boolean, timestamp} from "drizzle-orm/pg-core";

// 🔶 Semester Table
export const semesters = pgTable("semesters", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(),
  is_active: boolean("is_active").notNull(),
});

// 🔶 Course Table
export const courses = pgTable("courses", {
  id: text("id").primaryKey().notNull(), // CSE2202, etc.
  semester_id: integer("semester_id")
    .references(() => semesters.id)
    .notNull(),
  name: text("name").notNull(),
  updated_at: timestamp("updated_at", { mode: "string" }).notNull(),
});

// 🔶 Class Table
export const classes = pgTable("classes", {
  id: text("id").primaryKey().notNull(),
  course_id: text("course_id")
    .references(() => courses.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  topics: text("topics").array(),        // string[]
  notes: text("notes").array().notNull(),          // string[]
  references: text("references").array(),// string[]
  contributors: text("contributors").array().notNull(), // string[]
  updated_at: timestamp("updated_at", { mode: "string" }).notNull(),
});
